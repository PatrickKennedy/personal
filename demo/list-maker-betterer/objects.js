function toggle_panel() {
  active = active ? false : true;
  if (active){
    jQuery(".inline-panel").slideDown(150);
    $step_panel.slideDown(150);
  } else {
    jQuery(".inline-panel").slideUp(150);
    $step_panel.slideUp(150, function() {jQuery(this).remove()});
  }
}

function copy_to_clipboard( text ){
  var copyDiv = document.createElement('div');
  document.body.appendChild(copyDiv);
  copyDiv.contentEditable = true;
  copyDiv.innerHTML = text;
  copyDiv.unselectable = "off";
  copyDiv.focus();
  document.execCommand('SelectAll');
  document.execCommand("Copy", false, null);
  document.body.removeChild(copyDiv);
}

function get_state(id) {
  var state;
  console.log("Getting State");
  state = localStorage[`state-${id}`];
  if (typeof state === "string")
    state = undefined;
  console.log(state);
  if (!state)
    state = {steps:[], reference:[]};

  return state;
}

function set_state(id, state) {
  jQuery("#sp-state").addClass("saving");
  console.log("Saving State for "+ id);
  console.log(state["steps"]);
  localStorage[`state-${id}`] = state;
  jQuery("#sp-state").removeClass("saving");
  console.log("Successfully Saved "+ id);
}

step_tools = {
  new: function () {
    var panel = ich.step_panel({memo: ""});
    return panel;
  },

  set_state: function(panel, index, state) {
    console.log(state);
    panel.find("#sp-memo").val(state["memo"]);
    panel.find(".tmb-button-group").find("#sp-"+state["color"])[0].checked = true;
    panel.find("#sp-index").text(index+1);
  },

  reapply_state: function() {

  },


  bind_handlers: function(panel, index, steps, step, save) {
    panel.find(".tmb-button-group .tmb-button").each(function(i) {
      var $this = jQuery(this);
      var $step = jQuery(step);
      $this
        .off("click.sp")
        .on("click.sp", function() {
        steps[index].color = jQuery("#"+$this.attr("for")).val();
        save();
        $step.removeClass("sp-user").removeClass("sp-neither").removeClass("sp-agent");
        $step.addClass("sp-"+ steps[index].color);
      });
    });

    var timer;
    panel.find("#sp-memo").off("input.sp").on("input.sp", function(e) {
      $this = jQuery(this);
      jQuery("#sp-state").addClass("saving");
      clearTimeout(timer);
      timer = setTimeout(function() {
        steps[index].memo = $this.val();
        save();
      }, 1000);
    });

    jQuery("#sp-remove").off("click.sp").on("click.sp", function() {
      console.log("clicked sp-remove");
      if (!active) return;
      console.log("Removing Line #"+ index);
      steps.splice(index, 1);
      save();
      step_tools.reapply_state();
    });

    jQuery("#sp-add").off("click.sp").on("click.sp", function() {
      console.log("clicked sp-add");
      if (!active) return;
      console.log("Adding Line after #"+ index);
      steps.splice(index+1, 0, {memo:"", color:"neither"});
      save();
      step_tools.reapply_state();
    });
  },

  set_inline_state: function($inline_panel, index, state) {
    $inline_panel.find(".memo-edit").text(state["memo"]);
    $inline_panel.find(".tmb-button-group").find("#sp-"+ state["color"] +"-"+ index)[0].checked = true;
  },

  bind_inline_handlers: function($inline_panel, index, steps, step, save) {
    $inline_panel.find(".memo-edit")
    .off("input.sp")
    .on("input.sp", function(e) {
      $this = jQuery(this);
      var timer = $this.data("timer");
      if (timer)
        clearTimeout(timer);
      $this.data("timer", setTimeout(function() {
        steps[index].memo = $this.text();
        set_state(id, state);
      }, 1000));
    });

    $inline_panel.find(".tmb-button-group .tmb-button").each(function(i) {
      var $this = jQuery(this);
      var $step = jQuery(step);
      $this
        .off("click.sp")
        .on("click.sp", function() {
        steps[index].color = jQuery("#"+$this.attr("for")).val();
        save();
        $step.removeClass("sp-user").removeClass("sp-neither").removeClass("sp-agent");
        $step.addClass("sp-"+ steps[index].color);
      });
    });
  }
}
