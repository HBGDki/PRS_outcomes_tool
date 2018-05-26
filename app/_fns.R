library(dplyr)

get_appl_pop <- function(hr_flagged, hr_actual, hypertensive, val) {
  isTRUE <- function(x) x == TRUE & !is.na(x)
  isFALSE <- function(x) x == FALSE & !is.na(x)

  if (val == "All") {
    res <- rep(1, length(hr_flagged))
  } else if (val == "Actually high risk (presume can discern)") {
    # X111="YES"
    res <- isTRUE(hr_actual)
  } else if (val == "All risk stratified") {
    # OR(W111="YES",W111="NO")
    res <- isTRUE(hr_flagged) | isFALSE(hr_flagged)
  } else if (val == "Risk stratified & flagged high risk") {
    # W111="YES"
    res <- isTRUE(hr_flagged)
  } else if (val == "Hypertensive only") {
    # Y111="YES"
    res <- isTRUE(hypertensive)
  } else if (val == "Hypertensive (and risk stratified)") {
    # AND(OR(W111="YES",W111="NO"),Y111="YES")
    res <- (isTRUE(hr_flagged) | isFALSE(hr_flagged)) & isTRUE(hypertensive)
  } else {
    stop("'", val, "' not recognized")
  }
  res <- as.integer(res)
  res[1:2] <- 0
  res
}

# FRU only
# PHC only
# Home only
# FRU and PHC
# FRU, PHC, and Home
get_site_of_care <- function(deliv_loc, val, locs_of_care) {
  res <- ifelse(deliv_loc == "FRU",
    val %in% c("FRU only", "FRU and PHC", "FRU, PHC, and Home"),
    ifelse(deliv_loc == "PHC",
      val %in% c("PHC only", "FRU and PHC", "FRU, PHC, and Home"),
      ifelse(deliv_loc == "Home",
        val %in% c("Home only", "FRU, PHC, and Home"),
        ifelse(deliv_loc == "Any",
          locs_of_care[[val]],
          NA
        )
      )
    )
  )
  as.numeric(res)
}

get_int_data <- function(cur_nm, prev_nm, ints, base_tab, pe_int_inputs, pop, der) {
  # cur_nm <- "mag_fru"
  # prev_nm <- "antihyper"

  # cur_nm <- "antihyper"
  # prev_nm <- "aspirin"

  # cur_nm <- "intantihyper"
  # prev_nm <- "mag_phc"

  cur_int_inputs <- subset(pe_int_inputs, name == paste("int", cur_nm, sep = "_"))

  obj <- base_tab

  obj$on <- as.integer(cur_int_inputs$on_off)
  obj$appl_pop <- get_appl_pop(
    obj$hr_flagged,
    obj$hr_actual,
    obj$hypertensive,
    cur_int_inputs$applied_to)
  obj$site_of_care <- get_site_of_care(
    obj$deliv_loc,
    cur_int_inputs$location_of_care,
    der$locs_of_care)

  obj$n_patient2 <- obj$n_patient *
    cur_int_inputs$elig_pop_haircut *
    cur_int_inputs$coverage *
    obj$on * obj$appl_pop * obj$site_of_care

  obj$n_pe <- ints[[prev_nm]]$n_pe_after
  obj$pe_rate <- ifelse(obj$n_patient == 0, 0, obj$n_pe / obj$n_patient)
  obj$n_pe2 <- obj$n_patient2 * obj$pe_rate
  obj$pe_reduce <- obj$n_pe2 * cur_int_inputs$eff_reducing_PE
  obj$n_pe_after <- obj$n_pe - obj$pe_reduce
  obj$n_pe_after2 <- obj$n_pe2 - obj$pe_reduce

  obj$mort_rate_mat <- ints[[prev_nm]]$mort_rate_mat_after
  obj$lifesave_mat <- cur_int_inputs$eff_reducing_mat_deaths *
    obj$n_pe2 *
    obj$mort_rate_mat
  # obj$mort_rate_mat_after <- ifelse(obj$n_pe_after2 == 0, obj$mort_rate_mat,
  #   (obj$mort_rate_mat * obj$n_pe2 - obj$lifesave_mat) / obj$n_pe_after2)
  obj$mort_rate_mat_after <- ifelse(obj$n_pe_after2 == 0, obj$mort_rate_mat,
    (obj$mort_rate_mat * obj$n_pe - obj$lifesave_mat) / obj$n_pe_after)

  obj$mort_rate_neo <- ints[[prev_nm]]$mort_rate_neo_after

  # NA coded to mean "Same # as mom" as seen in spreadsheet
  if (is.na(cur_int_inputs$eff_reducing_neo_deaths)) {
    obj$lifesave_neo <- obj$lifesave_mat
  } else {
    obj$lifesave_neo <- cur_int_inputs$eff_reducing_neo_deaths *
      obj$n_pe2 *
      obj$mort_rate_neo
  }
  # obj$mort_rate_neo_after <- ifelse(obj$n_pe_after2 == 0, obj$mort_rate_neo,
  #   (obj$mort_rate_neo * obj$n_pe2 - obj$lifesave_neo) / obj$n_pe_after2)
  obj$mort_rate_neo_after <- ifelse(obj$n_pe_after2 == 0, obj$mort_rate_neo,
    (obj$mort_rate_neo * obj$n_pe - obj$lifesave_neo) / obj$n_pe_after)

  obj
}

get_der <- function(pop, anc_cdf) {
  der <- list()
  der$n_pe <- pop$pop * pop$pe_rate # field:C12
  # % who get risk stratified
  der$riskstrat_pct <- (anc_cdf[pop$riskstrat_lastweek] - anc_cdf[pop$riskstrat_firstweek]) *
    pop$anc_visits1 # field:C89

  der$hr_tp <- pop$sensitivity * der$n_pe * der$riskstrat_pct # field:E94
  der$lr_tn <- pop$specificity * (pop$pop - der$n_pe) * der$riskstrat_pct # field:E98
  der$hr_fp <- der$riskstrat_pct * (pop$pop - der$n_pe) - der$lr_tn # field:E95
  der$lr_fn <- der$riskstrat_pct * der$n_pe - der$hr_tp # field: E99

  der$hr_flagged <- der$hr_tp + der$hr_fp # field: E93
  der$lr_flagged <- der$lr_tn + der$lr_fn # field: E97

  der$n_riskstrat <- der$hr_flagged + der$lr_flagged  # field:C90

  der$hr_tp_pct <- der$hr_tp / (der$hr_tp + der$lr_tn + der$hr_fp + der$lr_fn + der$lr_flagged)
  der$hr_fp_pct <- der$hr_fp / (der$hr_tp + der$lr_tn + der$hr_fp + der$lr_fn + der$lr_flagged)

  der$lr_tn_pct <- der$lr_tn / (der$hr_tp + der$lr_tn + der$hr_fp + der$lr_fn + der$lr_flagged)
  der$lr_fn_pct <- der$lr_fn / (der$hr_tp + der$lr_tn + der$hr_fp + der$lr_fn + der$lr_flagged)

  der$hr_flagged_pct <- der$hr_tp_pct + der$hr_fp_pct
  der$lr_flagged_pct <- der$lr_tn_pct + der$lr_fn_pct

  der$nostrat_hr <- ((pop$pop - der$n_riskstrat) / pop$pop) * der$n_pe
  der$nostrat_lr <- ((pop$pop - der$n_riskstrat) / pop$pop) * (pop$pop - der$n_pe)

  der$locs_of_care <- list(
    "FRU only" = pop$sys_fru_pct,
    "PHC only" = pop$sys_phc_pct,
    "Home only" = pop$sys_home_pct,
    "FRU and PHC" = pop$sys_fru_pct + pop$sys_phc_pct,
    "FRU, PHC, and Home" = pop$sys_fru_pct + pop$sys_phc_pct + pop$sys_home_pct,
    "None" = 0
  )

  # % who get it
  der$ante_pct <- pop$anc_visits4 / der$riskstrat_pct # 0.617768559 # field:C55

  # % early onset that are caught in right period # field:C46
  der$eo_caught <- pop$anc_visits4 + (anc_cdf[34] - anc_cdf[25]) * pop$anc_visits1
  # % actually high risk that are early onset # field:C47
  der$hr_act_eo <- der$eo_caught * 0.1

  # % of low risk that has GHTN # field:C48
  der$lr_act_w_ghtn_pct <- (pop$pop_ghtn_pct * pop$pop - pop$hr_act_w_ghtn_pct * der$n_pe) / (pop$pop - der$n_pe)

  der
}

get_ints <- function(pop, der, pe_int_inputs, base_tab) {
  base_tab$n_patient <- NA

  base_tab$n_patient[1] <- der$hr_tp * pop$hr_act_w_ghtn_pct * der$hr_act_eo * (1 - pop$leak_fru_phc)
  base_tab$n_patient[2] <- der$hr_tp * pop$hr_act_w_ghtn_pct * der$hr_act_eo * pop$leak_fru_phc
  base_tab$n_patient[3] <- der$hr_tp * pop$hr_act_w_ghtn_pct * (1 - der$hr_act_eo) * (1 - pop$leak_fru_phc) * (der$ante_pct * pop$flagintime_pct + (1 - der$ante_pct) * (pop$sys_fru_pct / (pop$sys_fru_pct + pop$sys_phc_pct)))
  base_tab$n_patient[4] <- der$hr_tp * pop$hr_act_w_ghtn_pct * (1 - der$hr_act_eo ) - base_tab$n_patient[3]
  base_tab$n_patient[5] <- der$hr_tp * (1 - pop$hr_act_w_ghtn_pct ) * (1 - pop$leak_fru_phc) * (der$ante_pct * pop$flagintime_pct + (1 - der$ante_pct) * (pop$sys_fru_pct / (pop$sys_fru_pct + pop$sys_phc_pct)))
  base_tab$n_patient[6] <- der$hr_tp * (1 - pop$hr_act_w_ghtn_pct ) - base_tab$n_patient[5]
  base_tab$n_patient[7] <- der$hr_fp * der$lr_act_w_ghtn_pct * (1 - pop$leak_fru_phc)
  base_tab$n_patient[8] <- der$hr_fp * der$lr_act_w_ghtn_pct * pop$leak_fru_phc
  base_tab$n_patient[9] <- der$hr_fp * (1 - der$lr_act_w_ghtn_pct) * (1 - pop$leak_fru_phc)
  base_tab$n_patient[10] <- der$hr_fp * (1 - der$lr_act_w_ghtn_pct) * (pop$leak_fru_phc)
  base_tab$n_patient[11] <- der$lr_fn * pop$hr_act_w_ghtn_pct * der$hr_act_eo * (1 - pop$leak_fru_phc)
  base_tab$n_patient[12] <- der$lr_fn * pop$hr_act_w_ghtn_pct * der$hr_act_eo * (pop$leak_fru_phc)
  base_tab$n_patient[13] <- der$lr_fn * pop$hr_act_w_ghtn_pct * (1 - der$hr_act_eo ) * (1 - pop$leak_phc_home)
  base_tab$n_patient[14] <- der$lr_fn * pop$hr_act_w_ghtn_pct * (1 - der$hr_act_eo ) * pop$leak_phc_home
  base_tab$n_patient[15] <- der$lr_fn * (1 - pop$hr_act_w_ghtn_pct ) * (1 - pop$leak_phc_home)
  base_tab$n_patient[16] <- der$lr_fn * (1 - pop$hr_act_w_ghtn_pct ) * (pop$leak_phc_home)
  base_tab$n_patient[17] <- der$lr_tn * der$lr_act_w_ghtn_pct * (1 - pop$leak_phc_home)
  base_tab$n_patient[18] <- der$lr_tn * der$lr_act_w_ghtn_pct * (pop$leak_phc_home)
  base_tab$n_patient[19] <- der$lr_tn * (1 - der$lr_act_w_ghtn_pct) * (1 - pop$leak_phc_home)
  base_tab$n_patient[20] <- der$lr_tn * (1 - der$lr_act_w_ghtn_pct) * pop$leak_phc_home
  base_tab$n_patient[21] <- der$nostrat_hr * pop$hr_act_w_ghtn_pct * der$hr_act_eo * pop$sys_fru_pct
  base_tab$n_patient[22] <- der$nostrat_hr * pop$hr_act_w_ghtn_pct * der$hr_act_eo * pop$sys_phc_pct
  base_tab$n_patient[23] <- der$nostrat_hr * pop$hr_act_w_ghtn_pct * der$hr_act_eo * pop$sys_home_pct
  base_tab$n_patient[24] <- der$nostrat_hr * pop$hr_act_w_ghtn_pct * (1 - der$hr_act_eo) * pop$sys_fru_pct
  base_tab$n_patient[25] <- der$nostrat_hr * pop$hr_act_w_ghtn_pct * (1 - der$hr_act_eo) * pop$sys_phc_pct
  base_tab$n_patient[26] <- der$nostrat_hr * pop$hr_act_w_ghtn_pct * (1 - der$hr_act_eo) * pop$sys_home_pct
  base_tab$n_patient[27] <- der$nostrat_hr * (1 - pop$hr_act_w_ghtn_pct) * pop$sys_fru_pct
  base_tab$n_patient[28] <- der$nostrat_hr * (1 - pop$hr_act_w_ghtn_pct) * pop$sys_phc_pct
  base_tab$n_patient[29] <- der$nostrat_hr * (1 - pop$hr_act_w_ghtn_pct) * pop$sys_home_pct
  base_tab$n_patient[30] <- der$nostrat_lr

  sum(base_tab$n_patient)
  # 25642000

  base_tab$n_pe <- base_tab$n_patient * base_tab$hr_actual
  base_tab$mort_rate_mat <- pop$mort_rate_mat
  base_tab$mort_rate_neo <- pop$mort_rate_neo

  ## build list of tables for each intervention
  ##---------------------------------------------------------

  ints <- list()

  ##
  ##---------------------------------------------------------

  obj <- base_tab

  obj$n_pe_after <- obj$n_pe

  obj$mort_rate_mat_after <- obj$mort_rate_mat
  obj$mort_rate_mat_after[1] <- pop$cfr_fru_maternal
  obj$mort_rate_mat_after[2] <- pop$cfr_phc_maternal
  obj$mort_rate_mat_after[11] <- pop$cfr_fru_maternal
  obj$mort_rate_mat_after[12] <- pop$cfr_phc_maternal

  obj$mort_rate_neo_after <- obj$mort_rate_neo
  obj$mort_rate_neo_after[1] <- pop$cfr_fru_neonatal
  obj$mort_rate_neo_after[2] <- pop$cfr_phc_neonatal
  obj$mort_rate_neo_after[11] <- pop$cfr_fru_neonatal
  obj$mort_rate_neo_after[12] <- pop$cfr_phc_neonatal

  obj$lifesave_mat <- obj$n_pe * obj$mort_rate_mat - obj$n_pe_after * obj$mort_rate_mat_after
  obj$lifesave_neo <- obj$n_pe * obj$mort_rate_neo - obj$n_pe_after * obj$mort_rate_neo_after
  obj$pe_reduce <- 0

  # sum(obj$lifesave_mat)
  # sum(obj$lifesave_neo)

  ints$am <- obj

  ##
  ##---------------------------------------------------------

  obj <- base_tab
  obj$n_pe_after <- obj$n_pe
  # assuming global_coverage_assumption is always "Static"
  obj$mort_rate_mat <- ints$am$mort_rate_mat_after
  obj$mort_rate_mat_after <- ifelse(obj$deliv_loc == "FRU",
    pop$cfr_fru_maternal, pop$cfr_phc_maternal)
  obj$mort_rate_neo <- ints$am$mort_rate_neo_after
  obj$mort_rate_neo_after <- ifelse(obj$deliv_loc == "FRU",
    pop$cfr_fru_neonatal, pop$cfr_phc_neonatal)

  obj$lifesave_mat <- obj$n_pe * obj$mort_rate_mat - obj$n_pe_after * obj$mort_rate_mat_after
  obj$lifesave_neo <- obj$n_pe * obj$mort_rate_neo - obj$n_pe_after * obj$mort_rate_neo_after
  obj$pe_reduce <- 0

  # sum(obj$lifesave_mat)
  # sum(obj$lifesave_neo)

  # this is a hack to get final n_patient count right for this intervention
  # (since it's a special case)
  obj$n_patient2 <- 0
  obj$n_patient2[1] <- der$n_riskstrat

  ints$am_diff_cfl <- obj

  ##
  ##---------------------------------------------------------

  # pe_int_inputs$on_off[4] <- TRUE

  obj <- get_int_data("am_csect", "am_diff_cfl", ints, base_tab, pe_int_inputs, pop, der)
  ints$am_csect <- obj

  obj <- get_int_data("calcium", "am_csect", ints, base_tab, pe_int_inputs, pop, der)
  ints$calcium <- obj

  obj <- get_int_data("selenium", "calcium", ints, base_tab, pe_int_inputs, pop, der)
  ints$selenium <- obj

  obj <- get_int_data("statins", "selenium", ints, base_tab, pe_int_inputs, pop, der)
  ints$statins <- obj

  obj <- get_int_data("aspirin", "statins", ints, base_tab, pe_int_inputs, pop, der)
  ints$aspirin <- obj

  obj <- get_int_data("antihyper", "aspirin", ints, base_tab, pe_int_inputs, pop, der)
  ints$antihyper <- obj

  obj <- get_int_data("mag_fru", "antihyper", ints, base_tab, pe_int_inputs, pop, der)
  ints$mag_fru <- obj

  obj <- get_int_data("mag_phc", "mag_fru", ints, base_tab, pe_int_inputs, pop, der)
  ints$mag_phc <- obj

  obj <- get_int_data("intantihyper", "mag_phc", ints, base_tab, pe_int_inputs, pop, der)
  ints$intantihyper <- obj

  obj <- get_int_data("drug", "intantihyper", ints, base_tab, pe_int_inputs, pop, der)
  ints$drug <- obj

  # sum(obj$pe_reduce)
  # sum(obj$lifesave_mat)
  # sum(obj$lifesave_neo)

  lapply(names(ints)[-1], function(nm) {
    x <- ints[[nm]]
    dplyr::data_frame(
      name = nm,
      pe_reduce = round(sum(x$pe_reduce)),
      lifesave_mat = round(sum(x$lifesave_mat)),
      lifesave_neo = round(sum(x$lifesave_neo)),
      n_patient = round(sum(x$n_patient2))
    )
  }) %>%
  dplyr::bind_rows()
}

