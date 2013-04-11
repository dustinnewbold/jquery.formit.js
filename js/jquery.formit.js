;(function($) {
	var defaults = {
			placeholders : true,
			phColor      : '#999',
			phColorAttr  : 'data-color',
			phIsSetAttr  : 'data-isset',
			patterns     : true, // NYI: Future implementation
			requireds    : true,
			message      : '%1 is missing a value',
			output       : function() {
				alert(message);
			},
		},
		supported = {
			required     : null,
			placeholders : null,
			patterns     : null
		}

	var formit = function(el, options) {
		this.el = el;
		this.options = $.extend({}, defaults, options);

		this.init();
	}

	formit.prototype.init = function() {
		var fi = this;

		// Detect to see if requireds are supported by the browser
		var input = document.createElement('input');
		supported.required = ( 'required' in input );
		supported.placeholder = ( 'placeholder' in input );
		supported.pattern = ( 'pattern' in input );

		this.el.on('submit', function(e) {
			var pass = true;

			if ( fi.checkrequires() === false ) {
				pass = false;
			}

			if ( pass === false ) {
				e.preventDefault();
				alert('You are missing some fields.');
			}
		});

		this.placeholders();
	}

	formit.prototype.checkrequires = function(el) {
		if ( this.options.requireds === true && supported.required === false ) {
			var fi = this,
				returnVal = true;

			fi.el.find('[require=required]').each(function() {
				var $this = $(this),
					val = $.trim($this.val());
				if ( val === '' ) {
					returnVal = false;
					return false;
				}
			});

			return returnVal;
		}

		return true;
	}

	formit.prototype.checkpattern = function(pattern) {
		console.log(pattern);
	}

	formit.prototype.placeholders = function() {
		var fi = this;

		if ( this.options.placeholders === true &&  supported.placeholder === false ) {
			this.el.find('[placeholde]').each(function() {
				var $this = $(this),
					text = $this.attr('placeholde')
					color = null;

				if ( $this.attr(fi.options.phColorAttr) === true ) {
					color = $this.attr(fi.options.phColorAttr);
				} else {
					color = $this.css('color');
				}

				function setPH() {
					$this.val(text)
						 .css('color', fi.options.phColor)
						 .attr(fi.options.phIsSetAttr, 'true');
				}

				$this.attr(fi.options.phColorAttr, color);
				$this.on('focus', function() {
					if ( $this.attr(fi.options.phIsSetAttr) === 'true' ) {
						$this.val('')
							 .css('color', color);
					}
				});

				$this.on('blur', function() {
					if ( $.trim($this.val()) === '' ) {
						setPH();
					} else {
						$this.attr(fi.options.phIsSetAttr, 'false');
					}
				});

				if ( $.trim($this.val()) === '' ) {
					setPH();
				}
			});
		}
	}

	$.fn.formit = function(options) {
		var $this = $(this),
			forms = new formit($this, options);

		return $this;
	}
})(jQuery);