var mySliderBinding = new Shiny.InputBinding();
$.extend(mySliderBinding, {
  find: function(scope) {
    return $(scope).find(".shiny-my-slider");
  },
  getValue: function(el) {
    return parseFloat($(el).data('value')) / 100;
  },
  subscribe: function(el, callback) {
    $(el).on("change.mySliderBinding", function(e) {
      callback();
    });
  },
  unsubscribe: function(el) {
    $(el).off(".mySliderBinding");
  }
});

Shiny.inputBindings.register(mySliderBinding);
