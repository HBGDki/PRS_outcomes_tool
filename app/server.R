source("_fns.R")
load("_data.Rdata")

function(input, output) {

  pe_int_inputs_react_sc1 <- reactive({
    sc <- input$scenario_state

    res <- pe_int_inputs_orig[[sc[1]]]
    for (i in 2:nrow(res)) {
      for (vr in names(res[-c(1, 2)])) {
        nm <- paste0(vr, "_", res$name[i], "_sc1")
        if (!is.null(input[[nm]]))
          res[i, vr] <- input[[nm]]
      }
    }
    res
  })

  pop_react_sc1 <- reactive({
    sc <- input$scenario_state

    res <- list()
    for (nm in names(pop_orig[[sc[1]]])) {
      nm2 <- paste0(nm, "_sc1")
      if (!is.null(input[[nm2]]) && !is.na(input[[nm2]])) {
        res[[nm]] <- input[[nm2]]
      }
      if (is.null(res[[nm]]))
        res[[nm]] <- pop_orig[[sc[1]]][[nm]]
    }
    if (!is.null(input$sys_deliv_pct_sc1)) {
      tmp <- input$sys_deliv_pct_sc1
      if (length(tmp) == 2) {
        res$sys_fru_pct <- tmp[1] / 100
        res$sys_phc_pct <- (tmp[2] - tmp[1]) / 100
        res$sys_home_pct <- (100 - tmp[2]) / 100
      }
    }
    res
  })

  der_react_sc1 <- reactive({
    get_der(pop_react_sc1(), anc_cdfs)
  })

  ints_react_sc1 <- reactive({
    get_ints(
      pop_react_sc1(),
      der_react_sc1(),
      pe_int_inputs_react_sc1(),
      base_tab_empty
    )
  })

  output$output_sc1 <- reactive({
    ints <- ints_react_sc1()

    ints_tot <- lapply(ints[,
      c("pe_reduce", "lifesave_mat", "lifesave_neo", "n_patient")], sum)

    list(
      idx = 1,
      pop = pop_react_sc1(),
      der = der_react_sc1(),
      ints = ints,
      ints_tot = ints_tot
    )
  })

  ##
  ##---------------------------------------------------------

  pe_int_inputs_react_sc2 <- reactive({
    sc <- input$scenario_state

    res <- pe_int_inputs_orig[[sc[2]]]
    for (i in 2:nrow(res)) {
      for (vr in names(res[-c(1, 2)])) {
        nm <- paste0(vr, "_", res$name[i], "_sc2")
        if (!is.null(input[[nm]]))
          res[i, vr] <- input[[nm]]
      }
    }
    res
  })

  pop_react_sc2 <- reactive({
    sc <- input$scenario_state

    res <- list()
    for (nm in names(pop_orig[[sc[2]]])) {
      nm2 <- paste0(nm, "_sc2")
      if (!is.null(input[[nm2]]) && !is.na(input[[nm2]])) {
        res[[nm]] <- input[[nm2]]
      }
      if (is.null(res[[nm]]))
        res[[nm]] <- pop_orig[[sc[2]]][[nm]]
    }
    if (!is.null(input$sys_deliv_pct_sc2)) {
      tmp <- input$sys_deliv_pct_sc2
      if (length(tmp) == 2) {
        res$sys_fru_pct <- tmp[1] / 100
        res$sys_phc_pct <- (tmp[2] - tmp[1]) / 100
        res$sys_home_pct <- (100 - tmp[2]) / 100
      }
    }
    res
  })

  der_react_sc2 <- reactive({
    get_der(pop_react_sc2(), anc_cdfs)
  })

  ints_react_sc2 <- reactive({
    get_ints(
      pop_react_sc2(),
      der_react_sc2(),
      pe_int_inputs_react_sc2(),
      base_tab_empty
    )
  })

  output$output_sc2 <- reactive({
    ints <- ints_react_sc2()

    ints_tot <- lapply(ints[,
      c("pe_reduce", "lifesave_mat", "lifesave_neo", "n_patient")], sum)

    list(
      idx = 2,
      pop = pop_react_sc2(),
      der = der_react_sc2(),
      ints = ints,
      ints_tot = ints_tot
    )
  })

  ##
  ##---------------------------------------------------------

  pe_int_inputs_react_sc3 <- reactive({
    sc <- input$scenario_state

    res <- pe_int_inputs_orig[[sc[3]]]
    for (i in 2:nrow(res)) {
      for (vr in names(res[-c(1, 2)])) {
        nm <- paste0(vr, "_", res$name[i], "_sc3")
        if (!is.null(input[[nm]]))
          res[i, vr] <- input[[nm]]
      }
    }
    res
  })

  pop_react_sc3 <- reactive({
    sc <- input$scenario_state

    res <- list()
    for (nm in names(pop_orig[[sc[3]]])) {
      nm2 <- paste0(nm, "_sc3")
      if (!is.null(input[[nm2]]) && !is.na(input[[nm2]])) {
        res[[nm]] <- input[[nm2]]
      }
      if (is.null(res[[nm]]))
        res[[nm]] <- pop_orig[[sc[3]]][[nm]]
    }
    if (!is.null(input$sys_deliv_pct_sc3)) {
      tmp <- input$sys_deliv_pct_sc3
      if (length(tmp) == 2) {
        res$sys_fru_pct <- tmp[1] / 100
        res$sys_phc_pct <- (tmp[2] - tmp[1]) / 100
        res$sys_home_pct <- (100 - tmp[2]) / 100
      }
    }
    res
  })

  der_react_sc3 <- reactive({
    get_der(pop_react_sc3(), anc_cdfs)
  })

  ints_react_sc3 <- reactive({
    get_ints(
      pop_react_sc3(),
      der_react_sc3(),
      pe_int_inputs_react_sc3(),
      base_tab_empty
    )
  })

  output$output_sc3 <- reactive({
    ints <- ints_react_sc3()

    ints_tot <- lapply(ints[,
      c("pe_reduce", "lifesave_mat", "lifesave_neo", "n_patient")], sum)

    list(
      idx = 3,
      pop = pop_react_sc3(),
      der = der_react_sc3(),
      ints = ints,
      ints_tot = ints_tot
    )
  })

  # output$active_scenario <- reactive({
  #   input$actscen
  # })


  # output$ints_table <- shiny::renderTable({
  #   ints_react()
  # })

  # output$pe_table <- shiny::renderTable({
  #   pe_int_inputs_react_sc1()
  # })

  # output$pop_table <- shiny::renderTable({
  #   data.frame(var = names(pop_react()), val = unname(unlist(pop_react())))
  # })

}
