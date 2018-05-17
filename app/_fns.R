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
