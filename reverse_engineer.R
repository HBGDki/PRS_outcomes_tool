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

# antenatal care CDF
# anc_cdf <- c(0, 0, 0, 0.01829094, 0.04074504, 0.06759664, 0.09890153, 0.13451205, 0.17407471, 0.21704612, 0.2627304, 0.31033117, 0.35900826, 0.4079359, 0.45635737, 0.50361507, 0.54917553, 0.59263585, 0.63371515, 0.67224082, 0.70812972, 0.74136858, 0.77199645, 0.80008893, 0.82574634, 0.84908342, 0.87022135, 0.8892825, 0.90638642, 0.92164761, 0.93517563, 0.94707578, 0.95745043, 0.966402205, 0.974035475, 0.980457902, 0.985781404, 0.990121752, 0.993596935, 0.996325447, 0.998423229, 1.000000019)

anc_cdfs <- list(
  africa_whole = list(
    name = "Africa (whole)",
    fname = "africa_whole",
    source = "Tawiah (2011); KDE (smoothing) done by BCG.",
    cdf = c(0.007768444, 0.017561733, 0.029506813, 0.043618093, 0.059788543, 0.077802343, 0.097373023, 0.118197913, 0.140024913, 0.162714613, 0.186281173, 0.210903323, 0.236897883, 0.264659773, 0.294579843, 0.326957143, 0.361927103, 0.399416943, 0.439140643, 0.480628433, 0.523283973, 0.566448793, 0.609463123, 0.651710203, 0.692638073, 0.731766873, 0.768686063, 0.803046323, 0.834565193, 0.863032503, 0.888323433, 0.910409123, 0.929360333, 0.945341023, 0.958590413, 0.969400533, 0.978088529, 0.984971594, 0.990350454, 0.994496128, 0.997645313, 0.999999999)
  ),
  africa_east = list(
    name = "East Africa",
    fname = "africa_east",
    source = "Tawiah (2011); KDE (smoothing) done by BCG.",
    cdf = c(0.004581418, 0.010369186, 0.017455322, 0.025877991, 0.035621599, 0.046630239, 0.058835899, 0.07219607, 0.08673522, 0.10257884, 0.119971071, 0.139266811, 0.160896652, 0.185307922, 0.212892173, 0.243912204, 0.278447654, 0.316365805, 0.357326966, 0.400818347, 0.446209068, 0.492807439, 0.53991156, 0.586843271, 0.632962413, 0.677671414, 0.720415965, 0.760683875, 0.798026986, 0.832078217, 0.862579328, 0.889401078, 0.912551729, 0.932170159, 0.9485035, 0.96187719, 0.97265769, 0.981220535, 0.987927431, 0.993106781, 0.997048175, 1)
  ),
  africa_west = list(
    name = "West Africa",
    fname = "africa_west",
    source = "Tawiah (2011); KDE (smoothing) done by BCG.",
    cdf = c(0.01502597, 0.03224051, 0.05165803, 0.07323825, 0.09688939, 0.12247581, 0.14982911, 0.17876082, 0.20907691, 0.24059012, 0.2731283, 0.30653972, 0.34069269, 0.37547091, 0.41076498, 0.44646332, 0.48244089, 0.518551299, 0.554621309, 0.590449309, 0.625807609, 0.660450019, 0.694121099, 0.726567079, 0.757548649, 0.786851279, 0.814294249, 0.839737299, 0.863085249, 0.884288599, 0.903342969, 0.920285489, 0.935190009, 0.948161429, 0.959328779, 0.968838943, 0.976850087, 0.983524775, 0.989024968, 0.993507493, 0.997120419, 1)
  ),
  india = list(
    name = "India",
    fname = "india",
    source = "ICO (Bihar + UP, average taken); from BMGF. (2017)",
    cdf = c(0.01502597, 0.03224051, 0.05165803, 0.07323825, 0.09688939, 0.12247581, 0.14982911, 0.17876082, 0.20907691, 0.24059012, 0.2731283, 0.30653972, 0.34069269, 0.37547091, 0.41076498, 0.44646332, 0.48244089, 0.5185513, 0.55462131, 0.59044931, 0.62580761, 0.66045002, 0.6941211, 0.72656708, 0.75754865, 0.78685128, 0.81429425, 0.8397373, 0.86308525, 0.8842886, 0.90334297, 0.92028549, 0.93519001, 0.94816143, 0.95932878, 0.968838944, 0.976850088, 0.983524776, 0.989024969, 0.993507494, 0.99712042, 1)
  ),
  india_adj = list(
    name = "India (adj)",
    fname = "india_adj",
    source = "Not provided",
    cdf = c(0, 0, 0, 0.01829094, 0.04074504, 0.06759664, 0.09890153, 0.13451205, 0.17407471, 0.21704612, 0.2627304, 0.31033117, 0.35900826, 0.4079359, 0.45635737, 0.50361507, 0.54917553, 0.59263585, 0.63371515, 0.67224082, 0.70812972, 0.74136858, 0.77199645, 0.80008893, 0.82574634, 0.84908342, 0.87022135, 0.8892825, 0.90638642, 0.92164761, 0.93517563, 0.94707578, 0.95745043, 0.966402205, 0.974035475, 0.980457902, 0.985781404, 0.990121752, 0.993596935, 0.996325447, 0.998423229, 1)
  )
)

# library(ggplot2)

# for (obj in anc_cdfs) {
#   d <- data.frame(week = 1:42, cdf = obj$cdf)
#   p <- ggplot(d, aes(week, obj$cdf * 100)) +
#     geom_point() +
#     geom_line(size = 1) +
#     theme_bw() +
#     labs(
#       x = "Week",
#       y = "Percentage of patients who have sought ANC",
#       title = paste("ANC Cumulative Distribution Function for", obj$name),
#       subtitle = paste0("Source: ", obj$source))
#   ggsave(filename = paste0("app/www/images/", obj$fname, ".png"),
#     plot = p, width = 6.533937, height = 4.162896)
# }
# 300 * 4.162896 / 6.533937

pop <- list()

pop$pop <- 25642000 # field:C10
pop$pe_rate <- 0.110204196 # field:C11

# % maternal mortality rate (conditioned pre-eclampsia)
pop$mort_rate_mat <- 0.000898843
pop$mort_rate_neo <- 0.008988427

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


pop$anc_cdf <- "india_adj"

## derived
##---------------------------------------------------------

der <- list()

der$n_pe <- pop$pop * pop$pe_rate # field:C12
# % who get risk stratified
der$riskstrat_pct <- (anc_cdfs[[pop$anc_cdf]]$cdf[pop$riskstrat_lastweek] - anc_cdfs[[pop$anc_cdf]]$cdf[pop$riskstrat_firstweek]) *
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
der$eo_caught <- pop$anc_visits4 + (anc_cdfs[[pop$anc_cdf]]$cdf[34] - anc_cdfs[[pop$anc_cdf]]$cdf[25]) * pop$anc_visits1
# % actually high risk that are early onset # field:C47
der$hr_act_eo <- der$eo_caught * 0.1

# % of low risk that has GHTN # field:C48
der$lr_act_w_ghtn_pct <- (pop$pop_ghtn_pct * pop$pop - pop$hr_act_w_ghtn_pct * der$n_pe) / (pop$pop - der$n_pe)

## population data for East Africa
##---------------------------------------------------------

pop_ea <- list()

pop_ea$pop <- 13926208 # field:C10
pop_ea$pe_rate <- 0.205583027 # field:C11

# % maternal mortality rate (conditioned pre-eclampsia)
pop_ea$mort_rate_mat <- 0.002033886
pop_ea$mort_rate_neo <- 0.020338862

# percentage who have 1, 2, 3, 4 visits
pop_ea$anc_visits1 <- 0.742 # field:C36
# pop_ea$anc_visits2 <- 0.644666667 # field:C37 # NOT USED!!!
# pop_ea$anc_visits3 <- 0.547333333 # field:C38 # NOT USED!!!
pop_ea$anc_visits4 <- 0.45 # field:C39

pop_ea$sensitivity <- 0.75 # field:C30
pop_ea$specificity <- 0.75 # field:C311
pop_ea$riskstrat_firstweek <- 4 # field:C32
pop_ea$riskstrat_lastweek <- 42 # field:C33

# case fatality rate
pop_ea$cfr_fru_maternal <- 0.0005 # field:C19
pop_ea$cfr_phc_maternal <- 0.002210746 # field:C20
pop_ea$cfr_fru_neonatal <- 0.01105373 # field:C21
pop_ea$cfr_phc_neonatal <- 0.022107459 # field:C22

# systems
pop_ea$sys_fru_pct <- 0.16 # field:C25
pop_ea$sys_phc_pct <- 0.63 # field:C26
pop_ea$sys_home_pct <- 0.21 # field:C27

pop_ea$leak_fru_phc <- 0.1 # field:C51
pop_ea$leak_phc_home <- 0.1 # field:C52

# % of population that has gestational hypertension
pop_ea$pop_ghtn_pct <- 0.125 # field:C42

# % actually high risk that has GHTN
pop_ea$hr_act_w_ghtn_pct <- 0.8 # field:C45
# # % early onset that are caught in right period
# % actually high risk that are early onset

# Antenatal monitor settings
# # % of deaths before labor
# death_prelabor_pct <- 0.48 # field:C56 # NOT USED!!!
# # % of deaths in labor
# death_labor_pct <- 0.173 # field:C57 # NOT USED!!!
# % patients flagged at right time
pop_ea$flagintime_pct <- 0.95 # field:C58
# # % deaths before labor avoided
# death_prelabor_avoid_pct <- 0.5 # field:C59 # NOT USED!!!
# # % deaths during labor avoided
# death_labor_avoid_pct <- 0.4 # field:C60 # NOT USED!!!

pop_ea$anc_cdf <- "africa_east"

## derived data for East Africa
##---------------------------------------------------------

der_ea <- list()

der_ea$n_pe <- pop_ea$pop * pop_ea$pe_rate # field:C12
# % who get risk stratified
der_ea$riskstrat_pct <- (anc_cdfs[[pop_ea$anc_cdf]]$cdf[pop_ea$riskstrat_lastweek] - anc_cdfs[[pop_ea$anc_cdf]]$cdf[pop_ea$riskstrat_firstweek]) *
  pop_ea$anc_visits1 # field:C89

der_ea$hr_tp <- pop_ea$sensitivity * der_ea$n_pe * der_ea$riskstrat_pct # field:E94
der_ea$lr_tn <- pop_ea$specificity * (pop_ea$pop - der_ea$n_pe) * der_ea$riskstrat_pct # field:E98
der_ea$hr_fp <- der_ea$riskstrat_pct * (pop_ea$pop - der_ea$n_pe) - der_ea$lr_tn # field:E95
der_ea$lr_fn <- der_ea$riskstrat_pct * der_ea$n_pe - der_ea$hr_tp # field: E99

der_ea$hr_flagged <- der_ea$hr_tp + der_ea$hr_fp # field: E93
der_ea$lr_flagged <- der_ea$lr_tn + der_ea$lr_fn # field: E97

der_ea$n_riskstrat <- der_ea$hr_flagged + der_ea$lr_flagged  # field:C90

der_ea$hr_tp_pct <- der_ea$hr_tp / (der_ea$hr_tp + der_ea$lr_tn + der_ea$hr_fp + der_ea$lr_fn + der_ea$lr_flagged)
der_ea$hr_fp_pct <- der_ea$hr_fp / (der_ea$hr_tp + der_ea$lr_tn + der_ea$hr_fp + der_ea$lr_fn + der_ea$lr_flagged)

der_ea$lr_tn_pct <- der_ea$lr_tn / (der_ea$hr_tp + der_ea$lr_tn + der_ea$hr_fp + der_ea$lr_fn + der_ea$lr_flagged)
der_ea$lr_fn_pct <- der_ea$lr_fn / (der_ea$hr_tp + der_ea$lr_tn + der_ea$hr_fp + der_ea$lr_fn + der_ea$lr_flagged)

der_ea$hr_flagged_pct <- der_ea$hr_tp_pct + der_ea$hr_fp_pct
der_ea$lr_flagged_pct <- der_ea$lr_tn_pct + der_ea$lr_fn_pct

der_ea$nostrat_hr <- ((pop_ea$pop - der_ea$n_riskstrat) / pop_ea$pop) * der_ea$n_pe
der_ea$nostrat_lr <- ((pop_ea$pop - der_ea$n_riskstrat) / pop_ea$pop) * (pop_ea$pop - der_ea$n_pe)

der_ea$locs_of_care <- c(
  "FRU only" = pop_ea$sys_fru_pct,
  "PHC only" = pop_ea$sys_phc_pct,
  "Home only" = pop_ea$sys_home_pct,
  "FRU and PHC" = pop_ea$sys_fru_pct + pop_ea$sys_phc_pct,
  "FRU, PHC, and Home" = pop_ea$sys_fru_pct + pop_ea$sys_phc_pct + pop_ea$sys_home_pct,
  "None" = 0
)

# % who get it
der_ea$ante_pct <- pop_ea$anc_visits4 / der_ea$riskstrat_pct # 0.617768559 # field:C55

# % early onset that are caught in right period # field:C46
der_ea$eo_caught <- pop_ea$anc_visits4 + (anc_cdfs[[pop_ea$anc_cdf]]$cdf[34] - anc_cdfs[[pop_ea$anc_cdf]]$cdf[25]) * pop_ea$anc_visits1
# % actually high risk that are early onset # field:C47
der_ea$hr_act_eo <- der_ea$eo_caught * 0.1

# % of low risk that has GHTN # field:C48
der_ea$lr_act_w_ghtn_pct <- (pop_ea$pop_ghtn_pct * pop_ea$pop - pop_ea$hr_act_w_ghtn_pct * der_ea$n_pe) / (pop_ea$pop - der_ea$n_pe)


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
Antenatal monitoring + diff CFL,int_am_diff_cfl,TRUE,,,,,,,
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

pe_int_inputs_ea <- readr::read_csv('int,name,on_off,applied_to,location_of_care,coverage,elig_pop_haircut,eff_reducing_PE,eff_reducing_mat_deaths,eff_reducing_neo_deaths
Antenatal monitoring + diff CFL,int_am_diff_cfl,TRUE,,,,,,,
Antenatal monitoring + early C-section,int_am_csect,TRUE,All risk stratified,FRU only,1,1,0,0.29374,0.29374
Calcium,int_calcium,TRUE,All risk stratified,"FRU, PHC, and Home",0.5,0.75,0.33,0.33,0.33
Selenium for PE,int_selenium,FALSE,All risk stratified,"FRU, PHC, and Home",0.5,0.75,0.72,0.72,0.72
Statins,int_statins,TRUE,Risk stratified & flagged high risk,"FRU, PHC, and Home",0.5,0.5,0.03,0.03,0.03
Aspirin,int_aspirin,TRUE,All risk stratified,"FRU, PHC, and Home",0.5,0.5,0.546439687,0.546439687,0.546439687
Antihypertensives,int_antihyper,TRUE,Hypertensive (and risk stratified),FRU and PHC,0.5,1,0,0.1,0.1
Incremental magnesium roll-out - FRU,int_mag_fru,TRUE,Actually high risk (presume can discern),FRU only,0.5,0.75,0,0.46,NA
Incremental magnesium roll-out - PHC,int_mag_phc,TRUE,Actually high risk (presume can discern),PHC only,0.5,1,0,0.46,NA
Intrapartum antihypertensives,int_intantihyper,TRUE,Actually high risk (presume can discern),FRU only,0.5,1,0,0.015,0.015
Novel drug,int_drug,TRUE,All risk stratified,"FRU, PHC, and Home",0.5,1,0.5,0.5,0.5')

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

int_fe <- c("int_am_csect", "int_calcium", "int_aspirin", "int_antihyper")
int_fu <- c("int_selenium", "int_statins", "int_mag_fru", "int_mag_phc", "int_intantihyper", "int_drug")

pe_int_inputs$entry <- seq_len(nrow(pe_int_inputs)) - 1
pe_int_inputs_ea$entry <- seq_len(nrow(pe_int_inputs_ea)) - 1
# pe_int_inputs2 <- pe_int_inputs
# pe_int_inputs2$on_off[pe_int_inputs$name %in% int_fe] <- TRUE
# pe_int_inputs2$on_off[pe_int_inputs$name %in% int_fu] <- FALSE

# pe_int_inputs3 <- pe_int_inputs
# pe_int_inputs3$on_off <- FALSE

pe_int_inputs_orig <- list(pe_int_inputs, pe_int_inputs_ea)
pop_orig <- list(pop, pop_ea)

# save(base_tab_empty, anc_cdfs, pop_orig, pe_int_inputs_orig, file = "app/_data.Rdata")

sc <- list(
  list(
    name = "India Baseline",
    ints_fe = filter(pe_int_inputs_orig[[1]], name %in% int_fe),
    ints_fu = filter(pe_int_inputs_orig[[1]], name %in% int_fu),
    pops = pop_orig[[1]]
  ),
  list(
    name = "East Africa Baseline",
    ints_fe = filter(pe_int_inputs_orig[[2]], name %in% int_fe),
    ints_fu = filter(pe_int_inputs_orig[[2]], name %in% int_fu),
    pops = pop_orig[[2]]
  )
  # list(
  #   name = "India No Interventions",
  #   ints_fe = filter(pe_int_inputs_orig[[3]], name %in% int_fe),
  #   ints_fu = filter(pe_int_inputs_orig[[3]], name %in% int_fu),
  #   pops = pop_orig[[1]]
  # )
)

jsonlite::toJSON(sc, pretty = TRUE, auto_unbox = TRUE, digits = NA)


cat(paste(sapply(anc_cdfs, function(x) {
  paste0('<option value="', x$fname, '">', x$name, '</option>')
}), collapse = "\n"))

cat(paste(sapply(anc_cdfs, function(x) {
  paste0('<div id="img_', x$fname, '" style="display: none;"><img src="images/', x$fname, '.png" /></div>')
}), collapse = "\n"))



anc_cdfs2 <- unname(lapply(anc_cdfs, function(x) {
  x[c("name", "fname")]
}))
jsonlite::toJSON(anc_cdfs2, pretty = TRUE, auto_unbox = TRUE, digits = NA)
