function ink_it(pattern){
	var t = new Tokenizer();
	var tokens = t.tokenize_string( pattern );

	var c = new Compiler();
	var compiled = c.compile( tokens );

	var canvas = document.createElement( "canvas" );
	canvas.style.position = "fixed";
	canvas.style.top = 0;
	canvas.style.left = 0;
	canvas.style.bottom = 0;
	canvas.style.right = 0;
	canvas.id = "context_free_canvas";

  var old_canvas = document.getElementById('context_free_canvas');
  if(old_canvas) old_canvas.parentNode.removeChild(old_canvas);

	document.getElementById('container').append(canvas);

	var r = Renderer;
	// Not clearing the queue each time will make the renderer keep rendering
	// old scripts.
	r.queue = [];
	r.render( compiled, "context_free_canvas" );
}
