## inputs
##---------------------------------------------------------

pop <- 25642000 # field:C10
pe_rate <- 0.110204196 # field:C11

# % maternal mortality rate (conditioned pre-eclampsia)
mort_rate_mat <- 0.000898843
mort_rate_neo <- 0.008988427

sensitivity <- 0.75 # field:C30
specificity <- 0.75 # field:C311
# antenatal care CDF
anc_cdf <- c(0, 0, 0, 0.01829094, 0.04074504, 0.06759664, 0.09890153, 0.13451205, 0.17407471, 0.21704612, 0.2627304, 0.31033117, 0.35900826, 0.4079359, 0.45635737, 0.50361507, 0.54917553, 0.59263585, 0.63371515, 0.67224082, 0.70812972, 0.74136858, 0.77199645, 0.80008893, 0.82574634, 0.84908342, 0.87022135, 0.8892825, 0.90638642, 0.92164761, 0.93517563, 0.94707578, 0.95745043, 0.966402205, 0.974035475, 0.980457902, 0.985781404, 0.990121752, 0.993596935, 0.996325447, 0.998423229, 1.000000019)
# percentage who have 1, 2, 3, 4 visits
anc_visits <- c(0.742, 0.644666667, 0.547333333, 0.45) # fields:C36-C39
riskstrat_firstweek <- 4 # field:C32
riskstrat_lastweek <- 42 # field:C33

# case fatality rate
cfr_fru_maternal <- 0.000488501 # field:C19
cfr_phc_maternal <- 0.000977003 # field:C20
cfr_fru_neonatal <- 0.004885015 # field:C21
cfr_phc_neonatal <- 0.009770029 # field:C22

# systems
sys_fru_pct <- 0.16 # field:C25
sys_phc_pct <- 0.63 # field:C26
sys_home_pct <- 0.21 # field:C27

leak_fru_phc <- 0.1 # field:C51
leak_phc_home <- 0.1 # field:C52

# % actually high risk that has GHTN
hr_act_w_ghtn_pct <- 0.8 # field:C45
# % early onset that are caught in right period
eo_caught <- 0.554366652 # field:C46
# % actually high risk that are early onset
hr_act_eo <- 0.055436665 # field:C47
# % of low risk that has GHTN
lr_act_w_ghtn_pct <- 0.041398985 # field:C48

# Antenatal monitor settings
# % who get it
ante_pct <- 0.617768559 # field:C55
# % of deaths before labor
death_prelabor_pct <- 0.48 # field:C56
# % of deaths in labor
death_labor_pct <- 0.173 # field:C57
# % patients flagged at right time
flagintime_pct <- 0.95 # field:C58
# % deaths before labor avoided
death_prelabor_avoid_pct <- 0.5 # field:C59
# % deaths during labor avoided
death_labor_avoid_pct <- 0.4 # field:C60

## derived
##---------------------------------------------------------

n_pe <- pop * pe_rate # field:C12
# % who get risk stratified
riskstrat_pct <- (anc_cdf[riskstrat_lastweek] - anc_cdf[riskstrat_firstweek]) *
  anc_visits[1] # field:C89

hr_tp <- sensitivity * n_pe * riskstrat_pct # field:E94
lr_tp <- specificity * (pop - n_pe) * riskstrat_pct # field:E98
hr_fp <- riskstrat_pct * (pop - n_pe) - lr_tp # field:E95
lr_fn <- riskstrat_pct * n_pe - hr_tp # field: E99

hr_flagged <- hr_tp + hr_fp # field: E93
lr_flagged <- lr_tp + lr_fn # field: E97

n_riskstrat <- hr_flagged + lr_flagged  # field:C90

nostrat_hr <- ((pop - n_riskstrat) / pop) * n_pe
nostrat_lr <- ((pop - n_riskstrat) / pop) * (pop - n_pe)

locs_of_care <- c(
  "FRU only" = sys_fru_pct,
  "PHC only" = sys_phc_pct,
  "Home only" = sys_home_pct,
  "FRU and PHC" = sys_fru_pct + sys_phc_pct,
  "FRU, PHC, and Home" = sys_fru_pct + sys_phc_pct + sys_home_pct,
  "None" = 0
)

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

function(input, output) {
  output$table <- shiny::renderTable({
    for (i in 2:nrow(pe_int_inputs)) {
      nm <- paste0("on_off_", pe_int_inputs$name[i])
      if (!is.null(input[[nm]]))
        pe_int_inputs[i, "on_off"] <- input[[nm]]

      nm <- paste0("applied_to_", pe_int_inputs$name[i])
      if (!is.null(input[[nm]]))
        pe_int_inputs[i, "applied_to"] <- input[[nm]]

      nm <- paste0("location_of_care_", pe_int_inputs$name[i])
      if (!is.null(input[[nm]]))
        pe_int_inputs[i, "location_of_care"] <- input[[nm]]

      nm <- paste0("coverage_", pe_int_inputs$name[i])
      if (!is.null(input[[nm]]))
        pe_int_inputs[i, "coverage"] <- input[[nm]]

      nm <- paste0("elig_pop_haircut_", pe_int_inputs$name[i])
      if (!is.null(input[[nm]]))
        pe_int_inputs[i, "elig_pop_haircut"] <- input[[nm]]

      nm <- paste0("eff_reducing_PE_", pe_int_inputs$name[i])
      if (!is.null(input[[nm]]))
        pe_int_inputs[i, "eff_reducing_PE"] <- input[[nm]]

      nm <- paste0("eff_reducing_mat_deaths_", pe_int_inputs$name[i])
      if (!is.null(input[[nm]]))
        pe_int_inputs[i, "eff_reducing_mat_deaths"] <- input[[nm]]

      nm <- paste0("eff_reducing_new_deaths_", pe_int_inputs$name[i])
      if (!is.null(input[[nm]]))
        pe_int_inputs[i, "eff_reducing_new_deaths"] <- input[[nm]]
    }

    pe_int_inputs
  })
}
