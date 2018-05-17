library(dplyr)

## functions
##---------------------------------------------------------

# Hypertensive (and risk stratified)
# Hypertensive only
# Risk stratified & flagged high risk
# All risk stratified
# Actually high risk (presume can discern)
# All
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
          locs_of_care[val],
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

## inputs
##---------------------------------------------------------

pop <- list()

pop$pop <- 25642000 # field:C10
pop$pe_rate <- 0.110204196 # field:C11

# % maternal mortality rate (conditioned pre-eclampsia)
pop$mort_rate_mat <- 0.000898843
pop$mort_rate_neo <- 0.008988427

# antenatal care CDF
anc_cdf <- c(0, 0, 0, 0.01829094, 0.04074504, 0.06759664, 0.09890153, 0.13451205, 0.17407471, 0.21704612, 0.2627304, 0.31033117, 0.35900826, 0.4079359, 0.45635737, 0.50361507, 0.54917553, 0.59263585, 0.63371515, 0.67224082, 0.70812972, 0.74136858, 0.77199645, 0.80008893, 0.82574634, 0.84908342, 0.87022135, 0.8892825, 0.90638642, 0.92164761, 0.93517563, 0.94707578, 0.95745043, 0.966402205, 0.974035475, 0.980457902, 0.985781404, 0.990121752, 0.993596935, 0.996325447, 0.998423229, 1.000000019)
# percentage who have 1, 2, 3, 4 visits
pop$anc_visits1 <- 0.742 # field:C36
# pop$anc_visits2 <- 0.644666667 # field:C37 # NOT USED!!!
# pop$anc_visits3 <- 0.547333333 # field:C38 # NOT USED!!!
pop$anc_visits4 <- 0.45 # field:C39

pop$sensitivity <- 0.75 # field:C30
pop$specificity <- 0.75 # field:C311
pop$riskstrat_firstweek <- 4 # field:C32
pop$riskstrat_lastweek <- 42 # field:C33

# case fatality rate
pop$cfr_fru_maternal <- 0.000488501 # field:C19
pop$cfr_phc_maternal <- 0.000977003 # field:C20
pop$cfr_fru_neonatal <- 0.004885015 # field:C21
pop$cfr_phc_neonatal <- 0.009770029 # field:C22

# systems
pop$sys_fru_pct <- 0.16 # field:C25
pop$sys_phc_pct <- 0.63 # field:C26
pop$sys_home_pct <- 0.21 # field:C27

pop$leak_fru_phc <- 0.1 # field:C51
pop$leak_phc_home <- 0.1 # field:C52

# % of population that has gestational hypertension
pop$pop_ghtn_pct <- 0.125 # field:C42

# % actually high risk that has GHTN
pop$hr_act_w_ghtn_pct <- 0.8 # field:C45
# # % early onset that are caught in right period
# % actually high risk that are early onset

# Antenatal monitor settings
# # % of deaths before labor
# death_prelabor_pct <- 0.48 # field:C56 # NOT USED!!!
# # % of deaths in labor
# death_labor_pct <- 0.173 # field:C57 # NOT USED!!!
# % patients flagged at right time
pop$flagintime_pct <- 0.95 # field:C58
# # % deaths before labor avoided
# death_prelabor_avoid_pct <- 0.5 # field:C59 # NOT USED!!!
# # % deaths during labor avoided
# death_labor_avoid_pct <- 0.4 # field:C60 # NOT USED!!!

## derived
##---------------------------------------------------------

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

der$locs_of_care <- c(
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

## data
##---------------------------------------------------------

base_tab <- tibble::tribble(
  ~hr_flagged, ~hr_actual, ~hypertensive, ~proteinuria, ~deliv_loc,
  TRUE  , TRUE  , TRUE  , TRUE  , "FRU",
  TRUE  , TRUE  , TRUE  , TRUE  , "PHC",
  TRUE  , TRUE  , TRUE  , FALSE , "FRU",
  TRUE  , TRUE  , TRUE  , FALSE , "PHC",
  TRUE  , TRUE  , FALSE , NA    , "FRU",
  TRUE  , TRUE  , FALSE , NA    , "PHC",
  TRUE  , FALSE , TRUE  , FALSE , "FRU",
  TRUE  , FALSE , TRUE  , FALSE , "PHC",
  TRUE  , FALSE , FALSE , FALSE , "FRU",
  TRUE  , FALSE , FALSE , FALSE , "PHC",
  FALSE , TRUE  , TRUE  , TRUE  , "FRU",
  FALSE , TRUE  , TRUE  , TRUE  , "PHC",
  FALSE , TRUE  , TRUE  , FALSE , "PHC",
  FALSE , TRUE  , TRUE  , FALSE , "Home",
  FALSE , TRUE  , FALSE , NA    , "PHC",
  FALSE , TRUE  , FALSE , NA    , "Home",
  FALSE , FALSE , TRUE  , FALSE , "PHC",
  FALSE , FALSE , TRUE  , FALSE , "Home",
  FALSE , FALSE , FALSE , FALSE , "PHC",
  FALSE , FALSE , FALSE , FALSE , "Home",
  NA    , TRUE  , TRUE  , TRUE  , "FRU",
  NA    , TRUE  , TRUE  , TRUE  , "PHC",
  NA    , TRUE  , TRUE  , TRUE  , "Home",
  NA    , TRUE  , TRUE  , FALSE , "FRU",
  NA    , TRUE  , TRUE  , FALSE , "PHC",
  NA    , TRUE  , TRUE  , FALSE , "Home",
  NA    , TRUE  , FALSE , FALSE , "FRU",
  NA    , TRUE  , FALSE , FALSE , "PHC",
  NA    , TRUE  , FALSE , FALSE , "Home",
  NA    , FALSE , TRUE  , FALSE , "Any"
)

pe_int_inputs <- readr::read_csv('int,name,on_off,applied_to,location_of_care,coverage,elig_pop_haircut,eff_reducing_PE,eff_reducing_mat_deaths,eff_reducing_neo_deaths
Antenatal monitoring + diff CFL,int_am,TRUE,,,,,,,
Antenatal monitoring + early C-section,int_am_csect,TRUE,All risk stratified,FRU only,1,1,0,0.29374,0.29374
Calcium,int_calcium,TRUE,All risk stratified,"FRU, PHC, and Home",0.5,0.666134086,0.33,0.33,0.33
Selenium for PE,int_selenium,FALSE,All risk stratified,"FRU, PHC, and Home",0.5,0.666134086,0.72,0.72,0.72
Statins,int_statins,TRUE,Risk stratified & flagged high risk,"FRU, PHC, and Home",0.5,0.49436655,0.03,0.03,0.03
Aspirin,int_aspirin,TRUE,All risk stratified,"FRU, PHC, and Home",0.5,0.49436655,0.292922754,0.292922754,0.292922754
Antihypertensives,int_antihyper,TRUE,Hypertensive (and risk stratified),FRU and PHC,0.5,1,0,0.1,0.1
Incremental magnesium roll-out - FRU,int_mag_fru,TRUE,Actually high risk (presume can discern),FRU only,0.5,0.64,0,0.46,
Incremental magnesium roll-out - PHC,int_mag_phc,TRUE,Actually high risk (presume can discern),PHC only,0.5,1,0,0.46,
Intrapartum antihypertensives,int_intantihyper,TRUE,Actually high risk (presume can discern),FRU only,0.5,1,0,0.015,0.015
Novel drug,int_drug,TRUE,All,"FRU, PHC, and Home",0.5,1,0.5,0.5,0.5')

##
##---------------------------------------------------------

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
  data_frame(
    name = nm,
    pe_reduce = round(sum(x$pe_reduce)),
    lifesave_mat = round(sum(x$lifesave_mat)),
    lifesave_neo = round(sum(x$lifesave_neo))
  )
}) %>%
bind_rows()

# pe_int_inputs$name

jsonlite::toJSON(pe_int_inputs[-1,], pretty = TRUE)

jsonlite::toJSON(pop, pretty = TRUE, auto_unbox = TRUE, digits = NA)

input_desc <- list(
  # Demographics
  "pop" = "Population",
  "pe_rate" = "Pre-eclampsia rate",
  "mort_rate_mat" = "% maternal mortality rate (conditioned pre-eclampsia)",
  "mort_rate_neo" = "% neonatal mortality rate (conditioned pre-eclampsia)",
  "cfr_fru_maternal" = "Case fatality rate (FRU) - maternal",
  "cfr_phc_maternal" = "Case fatality rate (PHC) - maternal",
  "cfr_fru_neonatal" = "Case fatality rate (FRU) - neonatal",
  "cfr_phc_neonatal" = "Case fatality rate (PHC) - neonatal",
  # Systems
  "sys_fru_pct" = "% at FRU (of facility)",
  "sys_phc_pct" = "% at PHC (of facility)",
  "sys_home_pct" = "% at home",
  # (Systems leakage)
  "leak_fru_phc" = "FRU -> PHC",
  "leak_phc_home" = "PHC -> Home",
  # Risk stratification TPP
  "sensitivity" = "Sensitivity",
  "specificity" = "Specificity",
  "riskstrat_firstweek" = "First week for risk stratification",
  "riskstrat_lastweek" = "Last week for risk stratification",
  # ANC visits
  "anc_visits1" = "Percentage who have at least 1 ANC visit",
  "anc_visits4" = "Percentage who have at least 4 ANC visits",
  # Other
  # (Prevalence of gestational hypertension)
  "pop_ghtn_pct" = "% of population that has gestational hypertension",
  # (Breakdown by GHTN and PRU)
  "hr_act_w_ghtn_pct" = "% actually high risk that has GHTN",
  # (Antenatal monitor settings)
  "flagintime_pct" = "% patients flagged at right time"
)

setdiff(names(pop), names(input_desc))
setdiff(names(input_desc), names(pop))

base_tab_empty <- base_tab
pe_int_inputs_orig <- pe_int_inputs
# save(base_tab_empty, anc_cdf, pop, pe_int_inputs_orig, file = "app/_data.Rdata")


