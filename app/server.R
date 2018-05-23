source("_fns.R")
load("_data.Rdata")

function(input, output) {

  pe_int_inputs_react <- reactive({
    res <- pe_int_inputs_orig
    for (i in 2:nrow(res)) {
      for (vr in names(res[-c(1, 2)])) {
        nm <- paste0(vr, "_", res$name[i])
        if (!is.null(input[[nm]]))
          res[i, vr] <- input[[nm]]
      }
    }
    res
  })

  pop_react <- reactive({
    res <- list()
    for (nm in names(pop)) {
      if (!is.null(input[[nm]]))
        res[[nm]] <- input[[nm]]
      if (is.null(res[[nm]]))
        res[[nm]] <- pop[[nm]]
    }
    res
  })

  der_react <- reactive({
    get_der(pop_react(), anc_cdf)
  })

  ints_react <- reactive({
    get_ints(
      pop_react(),
      der_react(),
      pe_int_inputs_react(),
      base_tab_empty
    )
  })

  output$outputs <- reactive({
    ints <- ints_react()
    ints_tot <- lapply(ints[, c("pe_reduce", "lifesave_mat", "lifesave_neo")], sum)

    list(
      pop = pop_react(),
      der = der_react(),
      ints = ints,
      ints_tot = ints_tot
    )
  })

  # output$ints_table <- shiny::renderTable({
  #   ints_react()
  # })

  # output$pe_table <- shiny::renderTable({
  #   pe_int_inputs_react()
  # })

  # output$pop_table <- shiny::renderTable({
  #   data.frame(var = names(pop_react()), val = unname(unlist(pop_react())))
  # })

}

# 4154980 + 514608 + 1543825 + 12464941
# 12464941 / (4154980 + 12464941)
# (514608 + 1543825) / 2825856

# 4154980 + 1543825

