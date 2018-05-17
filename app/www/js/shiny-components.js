var mySliderBinding = new Shiny.InputBinding();
$.extend(mySliderBinding, {
  find: function(scope) {
    return $(scope).find(".shiny-my-slider");
  },
  getValue: function(el) {
    var denom = parseFloat($(el).data('denom'))
    return parseFloat($(el).data('value')) / denom;
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



var countUpOutputBinding = new Shiny.OutputBinding();
$.extend(countUpOutputBinding, {
  find: function(scope) {
    return $(scope).find('.shiny-countup-output');
  },
  renderValue: function(el, data) {
    var options = {
      useEasing: true,
      useGrouping: true,
      separator: ',',
      decimal: '.',
    };
    var next = parseFloat(data);
    var prev = parseFloat($(el).data("value"));
    if (isNaN(prev)) {
      prev = 0;
    } else {
      if (prev < next) {
        $(el).addClass("counting-up");
      } else {
        $(el).addClass("counting-down");
      }
    }
    var demo = new CountUp(el, prev, next, 0, 1.0, options);
    debugger;
    demo.start(function() {
      $(el).removeClass("counting-up");
      $(el).removeClass("counting-down");
    });
    $(el).data("value", next);
    // console.log(data)
    // $(el).html(data);
  }
});
Shiny.outputBindings.register(countUpOutputBinding);
