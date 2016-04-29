var active = false
    , id = "demo"
    , $step_panel = jQuery("#step_panel"),
    separator = " / "
    ;

ich.grabTemplates();

if ($step_panel.length === 0) $step_panel = jQuery(step_tools.new());

var state = get_state(id)
    , steps = state['steps']
    , list_path = "div.better > ol"
    ;


console.log("Initial State Loaded");
console.log(steps);

// Set Initial Environment
jQuery(`${list_path} > li`).each(function (index) {
  console.log("-- Initializing #"+ index);
  var $this = jQuery(this);
  if (!steps[index]) {
    steps[index] = {memo:"", color:"neither"};
    console.log("Creating step state.");
  }

  // Apply State
  console.log("Applying State");
  $this.addClass("sp-"+ steps[index]["color"]);

  // Setup Action Listers
  console.log("Attaching Click Handler");
  $this.dblclick(function() {
    if (!active) return;
    console.log("clicked #"+ index);
    step_tools.set_state($step_panel, index, steps[index]);
    step_tools.bind_handlers($step_panel, index, steps, this, function(){set_state(id, state)});
    $step_panel.insertAfter(this);
  });

  // Insert Checkboxes
  // - wrapping in a span allows for adjusting the style of the text after the checkbox
  $this.wrapInner("<span>");
  jQuery("<input class=\"memo-select\" type=\"checkbox\" name=\"memos\" value="+ index +">")
  .prependTo($this);

  // Insert Inline Properties
  var $inline_panel = jQuery(ich.inline_panel({index:index, memo:steps[index].memo})).appendTo($this);
  step_tools.set_inline_state($inline_panel, index, steps[index]);
  step_tools.bind_inline_handlers($inline_panel, index, steps, this, function(){set_state(id, state)});
});


jQuery("<div class=\"tmb-button-group\" style=\"display: inline-block;\">")
.append(jQuery("<div class=\"tmb-button generate-memo\">Generate Memos</div>")
        .off("click.sp")
        .on("click.sp", function(){
          var memo = "Completed DOC-"+ id;
          jQuery(".memo-select:checked").each(function (i) {
            $this = jQuery(this);
            var step_memo = steps[$this.val()].memo;
            if (step_memo)
              memo += separator + step_memo;
          });
          copy_to_clipboard(memo);
          jQuery('#memo').text(memo);
        })
       )
.append(jQuery("<div class=\"tmb-button generate-memo\">Clear</div>")
        .off("click.sp")
        .on("click.sp", function(){
          jQuery(".memo-select:checked").each(function (i) {
            this.checked = false;
          });
        })
       )
.append(jQuery("<div class=\"tmb-button generate-memo\">Enable</div>")
        .off("click.sp")
        .on("click.sp", function(){
          toggle_panel();
        })
       )
.appendTo(jQuery(list_path));
