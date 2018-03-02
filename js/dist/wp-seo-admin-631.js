(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _a11ySpeak = require("a11y-speak");

var _a11ySpeak2 = _interopRequireDefault(_a11ySpeak);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function () {
	"use strict";

	/**
  * Detects the wrong use of variables in title and description templates
  *
  * @param {element} e The element to verify.
  *
  * @returns {void}
  */

	function wpseoDetectWrongVariables(e) {
		var warn = false;
		var errorId = "";
		var wrongVariables = [];
		var authorVariables = ["userid", "name", "user_description"];
		var dateVariables = ["date"];
		var postVariables = ["title", "parent_title", "excerpt", "excerpt_only", "caption", "focuskw", "pt_single", "pt_plural", "modified", "id"];
		var specialVariables = ["term404", "searchphrase"];
		var taxonomyVariables = ["term_title", "term_description"];
		var taxonomyPostVariables = ["category", "category_description", "tag", "tag_description"];
		if (e.hasClass("posttype-template")) {
			wrongVariables = wrongVariables.concat(specialVariables, taxonomyVariables);
		} else if (e.hasClass("homepage-template")) {
			wrongVariables = wrongVariables.concat(authorVariables, dateVariables, postVariables, specialVariables, taxonomyVariables, taxonomyPostVariables);
		} else if (e.hasClass("taxonomy-template")) {
			wrongVariables = wrongVariables.concat(authorVariables, dateVariables, postVariables, specialVariables);
		} else if (e.hasClass("author-template")) {
			wrongVariables = wrongVariables.concat(postVariables, dateVariables, specialVariables, taxonomyVariables, taxonomyPostVariables);
		} else if (e.hasClass("date-template")) {
			wrongVariables = wrongVariables.concat(authorVariables, postVariables, specialVariables, taxonomyVariables, taxonomyPostVariables);
		} else if (e.hasClass("search-template")) {
			wrongVariables = wrongVariables.concat(authorVariables, dateVariables, postVariables, taxonomyVariables, taxonomyPostVariables, ["term404"]);
		} else if (e.hasClass("error404-template")) {
			wrongVariables = wrongVariables.concat(authorVariables, dateVariables, postVariables, taxonomyVariables, taxonomyPostVariables, ["searchphrase"]);
		}
		jQuery.each(wrongVariables, function (index, variable) {
			errorId = e.attr("id") + "-" + variable + "-warning";
			if (e.val().search("%%" + variable + "%%") !== -1) {
				e.addClass("wpseo-variable-warning-element");
				var msg = wpseoAdminL10n.variable_warning.replace("%s", "%%" + variable + "%%");
				if (jQuery("#" + errorId).length) {
					jQuery("#" + errorId).html(msg);
				} else {
					e.after(' <div id="' + errorId + '" class="wpseo-variable-warning">' + msg + "</div>");
				}

				(0, _a11ySpeak2.default)(wpseoAdminL10n.variable_warning.replace("%s", variable), "assertive");

				warn = true;
			} else {
				if (jQuery("#" + errorId).length) {
					jQuery("#" + errorId).remove();
				}
			}
		});
		if (warn === false) {
			e.removeClass("wpseo-variable-warning-element");
		}
	}

	/**
  * Sets a specific WP option
  *
  * @param {string} option The option to update.
  * @param {string} newval The new value for the option.
  * @param {string} hide   The ID of the element to hide on success.
  * @param {string} nonce  The nonce for the action.
  *
  * @returns {void}
  */
	function setWPOption(option, newval, hide, nonce) {
		jQuery.post(ajaxurl, {
			action: "wpseo_set_option",
			option: option,
			newval: newval,
			_wpnonce: nonce
		}, function (data) {
			if (data) {
				jQuery("#" + hide).hide();
			}
		});
	}

	/**
  * Copies the meta description for the homepage
  *
  * @returns {void}
  */
	function wpseoCopyHomeMeta() {
		jQuery("#og_frontpage_desc").val(jQuery("#meta_description").val());
	}

	/**
  * Makes sure we store the action hash so we can return to the right hash
  *
  * @returns {void}
  */
	function wpseoSetTabHash() {
		var conf = jQuery("#wpseo-conf");
		if (conf.length) {
			var currentUrl = conf.attr("action").split("#")[0];
			conf.attr("action", currentUrl + window.location.hash);
		}
	}

	/**
  * When the hash changes, get the base url from the action and then add the current hash
  */
	jQuery(window).on("hashchange", wpseoSetTabHash);

	/**
  * Add a Facebook admin for via AJAX.
  *
  * @returns {void}
  */
	function wpseoAddFbAdmin() {
		var targetForm = jQuery("#TB_ajaxContent");

		jQuery.post(ajaxurl, {
			_wpnonce: targetForm.find("input[name=fb_admin_nonce]").val(),
			admin_name: targetForm.find("input[name=fb_admin_name]").val(),
			admin_id: targetForm.find("input[name=fb_admin_id]").val(),
			action: "wpseo_add_fb_admin"
		}, function (response) {
			var resp = jQuery.parseJSON(response);

			targetForm.find("p.notice").remove();

			switch (resp.success) {
				case 1:

					targetForm.find("input[type=text]").val("");

					jQuery("#user_admin").append(resp.html);
					jQuery("#connected_fb_admins").show();
					tb_remove();
					break;
				case 0:
					targetForm.find(".form-wrap").prepend(resp.html);
					break;
			}
		});
	}

	/**
  * Adds select2 for selected fields.
  *
  * @returns {void}
  */
	function initSelect2() {
		var select2Width = "400px";

		// Select2 for General settings: your info: company or person. Width is the same as the width for the other fields on this page.
		jQuery("#company_or_person").select2({
			width: select2Width,
			language: wpseoSelect2Locale
		});

		// Select2 for Twitter card meta data in Settings
		jQuery("#twitter_card_type").select2({
			width: select2Width,
			language: wpseoSelect2Locale
		});

		// Select2 for taxonomy breadcrumbs in Advanced
		jQuery("#post_types-post-maintax").select2({
			width: select2Width,
			language: wpseoSelect2Locale
		});

		// Select2 for profile in Search Console
		jQuery("#profile").select2({
			width: select2Width,
			language: wpseoSelect2Locale
		});
	}

	/**
  * Set the initial active tab in the settings pages.
  *
  * @returns {void}
  */
	function setInitialActiveTab() {
		var activeTabId = window.location.hash.replace("#top#", "");
		/* In some cases, the second # gets replace by %23, which makes the tab
   * switching not work unless we do this. */
		if (activeTabId.search("#top") !== -1) {
			activeTabId = window.location.hash.replace("#top%23", "");
		}
		/*
   * WordPress uses fragment identifiers for its own in-page links, e.g.
   * `#wpbody-content` and other plugins may do that as well. Also, facebook
   * adds a `#_=_` see PR 506. In these cases and when it's empty, default
   * to the first tab.
   */
		if ("" === activeTabId || "#" === activeTabId.charAt(0)) {
			/*
    * Reminder: jQuery attr() gets the attribute value for only the first
    * element in the matched set so this will always be the first tab id.
    */
			activeTabId = jQuery(".wpseotab").attr("id");
		}

		jQuery("#" + activeTabId).addClass("active");
		jQuery("#" + activeTabId + "-tab").addClass("nav-tab-active").click();
	}

	window.wpseoDetectWrongVariables = wpseoDetectWrongVariables;
	window.setWPOption = setWPOption;
	window.wpseoCopyHomeMeta = wpseoCopyHomeMeta;
	// eslint-disable-next-line
	window.wpseoAddFbAdmin = wpseoAddFbAdmin;
	window.wpseo_add_fb_admin = wpseoAddFbAdmin;
	window.wpseoSetTabHash = wpseoSetTabHash;

	jQuery(document).ready(function () {
		/**
   * When the hash changes, get the base url from the action and then add the current hash.
   */
		wpseoSetTabHash();

		// Toggle the Author archives section.
		jQuery("#disable-author input[type='radio']").change(function () {
			// The value on is disabled, off is enabled.
			if (jQuery(this).is(":checked")) {
				jQuery("#author-archives-titles-metas-content").toggle(jQuery(this).val() === "off");
			}
		}).change();

		// Toggle the Date archives section.
		jQuery("#disable-date input[type='radio']").change(function () {
			// The value on is disabled, off is enabled.
			if (jQuery(this).is(":checked")) {
				jQuery("#date-archives-titles-metas-content").toggle(jQuery(this).val() === "off");
			}
		}).change();

		// Toggle the Media section.
		jQuery("#disable-attachment input[type='radio']").change(function () {
			// The value on is disabled, off is enabled.
			if (jQuery(this).is(":checked")) {
				jQuery("#media_settings").toggle(jQuery(this).val() === "off");
			}
		}).change();

		// Toggle the Format-based archives section.
		jQuery("#disable-post_format").change(function () {
			jQuery("#post_format-titles-metas").toggle(jQuery(this).is(":not(:checked)"));
		}).change();

		// Toggle the Breadcrumbs section.
		jQuery("#breadcrumbs-enable").change(function () {
			jQuery("#breadcrumbsinfo").toggle(jQuery(this).is(":checked"));
		}).change();

		// Handle the settings pages tabs.
		jQuery("#wpseo-tabs").find("a").click(function () {
			jQuery("#wpseo-tabs").find("a").removeClass("nav-tab-active");
			jQuery(".wpseotab").removeClass("active");

			var id = jQuery(this).attr("id").replace("-tab", "");
			var activeTab = jQuery("#" + id);
			activeTab.addClass("active");
			jQuery(this).addClass("nav-tab-active");
			if (activeTab.hasClass("nosave")) {
				jQuery("#submit").hide();
			} else {
				jQuery("#submit").show();
			}
		});

		// Handle the Company or Person select.
		jQuery("#company_or_person").change(function () {
			var companyOrPerson = jQuery(this).val();
			if ("company" === companyOrPerson) {
				jQuery("#knowledge-graph-company").show();
				jQuery("#knowledge-graph-person").hide();
			} else if ("person" === companyOrPerson) {
				jQuery("#knowledge-graph-company").hide();
				jQuery("#knowledge-graph-person").show();
			} else {
				jQuery("#knowledge-graph-company").hide();
				jQuery("#knowledge-graph-person").hide();
			}
		}).change();

		// Check correct variables usage in title and description templates.
		jQuery(".template").change(function () {
			wpseoDetectWrongVariables(jQuery(this));
		}).change();

		// Prevent form submission when pressing Enter on the switch-toggles.
		jQuery(".switch-yoast-seo input").on("keydown", function (event) {
			if ("keydown" === event.type && 13 === event.which) {
				event.preventDefault();
			}
		});

		setInitialActiveTab();
		initSelect2();
	});
})(); /* global wpseoAdminL10n, ajaxurl, tb_remove, wpseoSelect2Locale */

},{"a11y-speak":2}],2:[function(require,module,exports){
var containerPolite, containerAssertive, previousMessage = "";

/**
 * Build the live regions markup.
 *
 * @param {String} ariaLive Optional. Value for the "aria-live" attribute, default "polite".
 *
 * @returns {Object} $container The ARIA live region jQuery object.
 */
var addContainer = function( ariaLive ) {
	ariaLive = ariaLive || "polite";

	var container = document.createElement( "div" );
	container.id = "a11y-speak-" + ariaLive;
	container.className = "a11y-speak-region";

	var screenReaderTextStyle = "clip: rect(1px, 1px, 1px, 1px); position: absolute; height: 1px; width: 1px; overflow: hidden; word-wrap: normal;";
	container.setAttribute( "style", screenReaderTextStyle );

	container.setAttribute( "aria-live", ariaLive );
	container.setAttribute( "aria-relevant", "additions text" );
	container.setAttribute( "aria-atomic", "true" );

	document.querySelector( "body" ).appendChild( container );
	return container;
};

/**
 * Specify a function to execute when the DOM is fully loaded.
 *
 * @param {Function} callback A function to execute after the DOM is ready.
 *
 * @returns {void}
 */
var domReady = function( callback ) {
	if ( document.readyState === "complete" || ( document.readyState !== "loading" && !document.documentElement.doScroll ) ) {
		return callback();
	}

	document.addEventListener( "DOMContentLoaded", callback );
};

/**
 * Create the live regions when the DOM is fully loaded.
 */
domReady( function() {
	containerPolite = document.getElementById( "a11y-speak-polite" );
	containerAssertive = document.getElementById( "a11y-speak-assertive" );

	if ( containerPolite === null ) {
		containerPolite = addContainer( "polite" );
	}
	if ( containerAssertive === null ) {
		containerAssertive = addContainer( "assertive" );
	}
} );

/**
 * Clear the live regions.
 */
var clear = function() {
	var regions = document.querySelectorAll( ".a11y-speak-region" );
	for ( var i = 0; i < regions.length; i++ ) {
		regions[ i ].textContent = "";
	}
};

/**
 * Update the ARIA live notification area text node.
 *
 * @param {String} message  The message to be announced by Assistive Technologies.
 * @param {String} ariaLive Optional. The politeness level for aria-live. Possible values:
 *                          polite or assertive. Default polite.
 */
var A11ySpeak = function( message, ariaLive ) {
	// Clear previous messages to allow repeated strings being read out.
	clear();

	/*
	 * Strip HTML tags (if any) from the message string. Ideally, messages should
	 * be simple strings, carefully crafted for specific use with A11ySpeak.
	 * When re-using already existing strings this will ensure simple HTML to be
	 * stripped out and replaced with a space. Browsers will collapse multiple
	 * spaces natively.
	 */
	message = message.replace( /<[^<>]+>/g, " " );

	if ( previousMessage === message ) {
		message = message + "\u00A0";
	}

	previousMessage = message;

	if ( containerAssertive && "assertive" === ariaLive ) {
		containerAssertive.textContent = message;
	} else if ( containerPolite ) {
		containerPolite.textContent = message;
	}
};

module.exports = A11ySpeak;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9zcmMvd3Atc2VvLWFkbWluLmpzIiwibm9kZV9tb2R1bGVzL2ExMXktc3BlYWsvYTExeS1zcGVhay5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDRUE7Ozs7OztBQUVFLGFBQVc7QUFDWjs7QUFFQTs7Ozs7Ozs7QUFPQSxVQUFTLHlCQUFULENBQW9DLENBQXBDLEVBQXdDO0FBQ3ZDLE1BQUksT0FBTyxLQUFYO0FBQ0EsTUFBSSxVQUFVLEVBQWQ7QUFDQSxNQUFJLGlCQUFpQixFQUFyQjtBQUNBLE1BQUksa0JBQWtCLENBQUUsUUFBRixFQUFZLE1BQVosRUFBb0Isa0JBQXBCLENBQXRCO0FBQ0EsTUFBSSxnQkFBZ0IsQ0FBRSxNQUFGLENBQXBCO0FBQ0EsTUFBSSxnQkFBZ0IsQ0FBRSxPQUFGLEVBQVcsY0FBWCxFQUEyQixTQUEzQixFQUFzQyxjQUF0QyxFQUFzRCxTQUF0RCxFQUFpRSxTQUFqRSxFQUE0RSxXQUE1RSxFQUF5RixXQUF6RixFQUFzRyxVQUF0RyxFQUFrSCxJQUFsSCxDQUFwQjtBQUNBLE1BQUksbUJBQW1CLENBQUUsU0FBRixFQUFhLGNBQWIsQ0FBdkI7QUFDQSxNQUFJLG9CQUFvQixDQUFFLFlBQUYsRUFBZ0Isa0JBQWhCLENBQXhCO0FBQ0EsTUFBSSx3QkFBd0IsQ0FBRSxVQUFGLEVBQWMsc0JBQWQsRUFBc0MsS0FBdEMsRUFBNkMsaUJBQTdDLENBQTVCO0FBQ0EsTUFBSyxFQUFFLFFBQUYsQ0FBWSxtQkFBWixDQUFMLEVBQXlDO0FBQ3hDLG9CQUFpQixlQUFlLE1BQWYsQ0FBdUIsZ0JBQXZCLEVBQXlDLGlCQUF6QyxDQUFqQjtBQUNBLEdBRkQsTUFHSyxJQUFLLEVBQUUsUUFBRixDQUFZLG1CQUFaLENBQUwsRUFBeUM7QUFDN0Msb0JBQWlCLGVBQWUsTUFBZixDQUF1QixlQUF2QixFQUF3QyxhQUF4QyxFQUF1RCxhQUF2RCxFQUFzRSxnQkFB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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKiBnbG9iYWwgd3BzZW9BZG1pbkwxMG4sIGFqYXh1cmwsIHRiX3JlbW92ZSwgd3BzZW9TZWxlY3QyTG9jYWxlICovXG5cbmltcG9ydCBhMTF5U3BlYWsgZnJvbSBcImExMXktc3BlYWtcIjtcblxuKCBmdW5jdGlvbigpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0LyoqXG5cdCAqIERldGVjdHMgdGhlIHdyb25nIHVzZSBvZiB2YXJpYWJsZXMgaW4gdGl0bGUgYW5kIGRlc2NyaXB0aW9uIHRlbXBsYXRlc1xuXHQgKlxuXHQgKiBAcGFyYW0ge2VsZW1lbnR9IGUgVGhlIGVsZW1lbnQgdG8gdmVyaWZ5LlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGZ1bmN0aW9uIHdwc2VvRGV0ZWN0V3JvbmdWYXJpYWJsZXMoIGUgKSB7XG5cdFx0dmFyIHdhcm4gPSBmYWxzZTtcblx0XHR2YXIgZXJyb3JJZCA9IFwiXCI7XG5cdFx0dmFyIHdyb25nVmFyaWFibGVzID0gW107XG5cdFx0dmFyIGF1dGhvclZhcmlhYmxlcyA9IFsgXCJ1c2VyaWRcIiwgXCJuYW1lXCIsIFwidXNlcl9kZXNjcmlwdGlvblwiIF07XG5cdFx0dmFyIGRhdGVWYXJpYWJsZXMgPSBbIFwiZGF0ZVwiIF07XG5cdFx0dmFyIHBvc3RWYXJpYWJsZXMgPSBbIFwidGl0bGVcIiwgXCJwYXJlbnRfdGl0bGVcIiwgXCJleGNlcnB0XCIsIFwiZXhjZXJwdF9vbmx5XCIsIFwiY2FwdGlvblwiLCBcImZvY3Vza3dcIiwgXCJwdF9zaW5nbGVcIiwgXCJwdF9wbHVyYWxcIiwgXCJtb2RpZmllZFwiLCBcImlkXCIgXTtcblx0XHR2YXIgc3BlY2lhbFZhcmlhYmxlcyA9IFsgXCJ0ZXJtNDA0XCIsIFwic2VhcmNocGhyYXNlXCIgXTtcblx0XHR2YXIgdGF4b25vbXlWYXJpYWJsZXMgPSBbIFwidGVybV90aXRsZVwiLCBcInRlcm1fZGVzY3JpcHRpb25cIiBdO1xuXHRcdHZhciB0YXhvbm9teVBvc3RWYXJpYWJsZXMgPSBbIFwiY2F0ZWdvcnlcIiwgXCJjYXRlZ29yeV9kZXNjcmlwdGlvblwiLCBcInRhZ1wiLCBcInRhZ19kZXNjcmlwdGlvblwiIF07XG5cdFx0aWYgKCBlLmhhc0NsYXNzKCBcInBvc3R0eXBlLXRlbXBsYXRlXCIgKSApIHtcblx0XHRcdHdyb25nVmFyaWFibGVzID0gd3JvbmdWYXJpYWJsZXMuY29uY2F0KCBzcGVjaWFsVmFyaWFibGVzLCB0YXhvbm9teVZhcmlhYmxlcyApO1xuXHRcdH1cblx0XHRlbHNlIGlmICggZS5oYXNDbGFzcyggXCJob21lcGFnZS10ZW1wbGF0ZVwiICkgKSB7XG5cdFx0XHR3cm9uZ1ZhcmlhYmxlcyA9IHdyb25nVmFyaWFibGVzLmNvbmNhdCggYXV0aG9yVmFyaWFibGVzLCBkYXRlVmFyaWFibGVzLCBwb3N0VmFyaWFibGVzLCBzcGVjaWFsVmFyaWFibGVzLCB0YXhvbm9teVZhcmlhYmxlcywgdGF4b25vbXlQb3N0VmFyaWFibGVzICk7XG5cdFx0fVxuXHRcdGVsc2UgaWYgKCBlLmhhc0NsYXNzKCBcInRheG9ub215LXRlbXBsYXRlXCIgKSApIHtcblx0XHRcdHdyb25nVmFyaWFibGVzID0gd3JvbmdWYXJpYWJsZXMuY29uY2F0KCBhdXRob3JWYXJpYWJsZXMsIGRhdGVWYXJpYWJsZXMsIHBvc3RWYXJpYWJsZXMsIHNwZWNpYWxWYXJpYWJsZXMgKTtcblx0XHR9XG5cdFx0ZWxzZSBpZiAoIGUuaGFzQ2xhc3MoIFwiYXV0aG9yLXRlbXBsYXRlXCIgKSApIHtcblx0XHRcdHdyb25nVmFyaWFibGVzID0gd3JvbmdWYXJpYWJsZXMuY29uY2F0KCBwb3N0VmFyaWFibGVzLCBkYXRlVmFyaWFibGVzLCBzcGVjaWFsVmFyaWFibGVzLCB0YXhvbm9teVZhcmlhYmxlcywgdGF4b25vbXlQb3N0VmFyaWFibGVzICk7XG5cdFx0fVxuXHRcdGVsc2UgaWYgKCBlLmhhc0NsYXNzKCBcImRhdGUtdGVtcGxhdGVcIiApICkge1xuXHRcdFx0d3JvbmdWYXJpYWJsZXMgPSB3cm9uZ1ZhcmlhYmxlcy5jb25jYXQoIGF1dGhvclZhcmlhYmxlcywgcG9zdFZhcmlhYmxlcywgc3BlY2lhbFZhcmlhYmxlcywgdGF4b25vbXlWYXJpYWJsZXMsIHRheG9ub215UG9zdFZhcmlhYmxlcyApO1xuXHRcdH1cblx0XHRlbHNlIGlmICggZS5oYXNDbGFzcyggXCJzZWFyY2gtdGVtcGxhdGVcIiApICkge1xuXHRcdFx0d3JvbmdWYXJpYWJsZXMgPSB3cm9uZ1ZhcmlhYmxlcy5jb25jYXQoIGF1dGhvclZhcmlhYmxlcywgZGF0ZVZhcmlhYmxlcywgcG9zdFZhcmlhYmxlcywgdGF4b25vbXlWYXJpYWJsZXMsIHRheG9ub215UG9zdFZhcmlhYmxlcywgWyBcInRlcm00MDRcIiBdICk7XG5cdFx0fVxuXHRcdGVsc2UgaWYgKCBlLmhhc0NsYXNzKCBcImVycm9yNDA0LXRlbXBsYXRlXCIgKSApIHtcblx0XHRcdHdyb25nVmFyaWFibGVzID0gd3JvbmdWYXJpYWJsZXMuY29uY2F0KCBhdXRob3JWYXJpYWJsZXMsIGRhdGVWYXJpYWJsZXMsIHBvc3RWYXJpYWJsZXMsIHRheG9ub215VmFyaWFibGVzLCB0YXhvbm9teVBvc3RWYXJpYWJsZXMsIFsgXCJzZWFyY2hwaHJhc2VcIiBdICk7XG5cdFx0fVxuXHRcdGpRdWVyeS5lYWNoKCB3cm9uZ1ZhcmlhYmxlcywgZnVuY3Rpb24oIGluZGV4LCB2YXJpYWJsZSApIHtcblx0XHRcdGVycm9ySWQgPSBlLmF0dHIoIFwiaWRcIiApICsgXCItXCIgKyB2YXJpYWJsZSArIFwiLXdhcm5pbmdcIjtcblx0XHRcdGlmICggZS52YWwoKS5zZWFyY2goIFwiJSVcIiArIHZhcmlhYmxlICsgXCIlJVwiICkgIT09IC0xICkge1xuXHRcdFx0XHRlLmFkZENsYXNzKCBcIndwc2VvLXZhcmlhYmxlLXdhcm5pbmctZWxlbWVudFwiICk7XG5cdFx0XHRcdHZhciBtc2cgPSB3cHNlb0FkbWluTDEwbi52YXJpYWJsZV93YXJuaW5nLnJlcGxhY2UoIFwiJXNcIiwgXCIlJVwiICsgdmFyaWFibGUgKyBcIiUlXCIgKTtcblx0XHRcdFx0aWYgKCBqUXVlcnkoIFwiI1wiICsgZXJyb3JJZCApLmxlbmd0aCApIHtcblx0XHRcdFx0XHRqUXVlcnkoIFwiI1wiICsgZXJyb3JJZCApLmh0bWwoIG1zZyApO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdGUuYWZ0ZXIoICcgPGRpdiBpZD1cIicgKyBlcnJvcklkICsgJ1wiIGNsYXNzPVwid3BzZW8tdmFyaWFibGUtd2FybmluZ1wiPicgKyBtc2cgKyBcIjwvZGl2PlwiICk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRhMTF5U3BlYWsoIHdwc2VvQWRtaW5MMTBuLnZhcmlhYmxlX3dhcm5pbmcucmVwbGFjZSggXCIlc1wiLCB2YXJpYWJsZSApLCBcImFzc2VydGl2ZVwiICk7XG5cblx0XHRcdFx0d2FybiA9IHRydWU7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0aWYgKCBqUXVlcnkoIFwiI1wiICsgZXJyb3JJZCApLmxlbmd0aCApIHtcblx0XHRcdFx0XHRqUXVlcnkoIFwiI1wiICsgZXJyb3JJZCApLnJlbW92ZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHRcdCk7XG5cdFx0aWYgKCB3YXJuID09PSBmYWxzZSApIHtcblx0XHRcdGUucmVtb3ZlQ2xhc3MoIFwid3BzZW8tdmFyaWFibGUtd2FybmluZy1lbGVtZW50XCIgKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogU2V0cyBhIHNwZWNpZmljIFdQIG9wdGlvblxuXHQgKlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gb3B0aW9uIFRoZSBvcHRpb24gdG8gdXBkYXRlLlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gbmV3dmFsIFRoZSBuZXcgdmFsdWUgZm9yIHRoZSBvcHRpb24uXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBoaWRlICAgVGhlIElEIG9mIHRoZSBlbGVtZW50IHRvIGhpZGUgb24gc3VjY2Vzcy5cblx0ICogQHBhcmFtIHtzdHJpbmd9IG5vbmNlICBUaGUgbm9uY2UgZm9yIHRoZSBhY3Rpb24uXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0ZnVuY3Rpb24gc2V0V1BPcHRpb24oIG9wdGlvbiwgbmV3dmFsLCBoaWRlLCBub25jZSApIHtcblx0XHRqUXVlcnkucG9zdCggYWpheHVybCwge1xuXHRcdFx0YWN0aW9uOiBcIndwc2VvX3NldF9vcHRpb25cIixcblx0XHRcdG9wdGlvbjogb3B0aW9uLFxuXHRcdFx0bmV3dmFsOiBuZXd2YWwsXG5cdFx0XHRfd3Bub25jZTogbm9uY2UsXG5cdFx0fSwgZnVuY3Rpb24oIGRhdGEgKSB7XG5cdFx0XHRpZiAoIGRhdGEgKSB7XG5cdFx0XHRcdGpRdWVyeSggXCIjXCIgKyBoaWRlICkuaGlkZSgpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHQpO1xuXHR9XG5cblx0LyoqXG5cdCAqIENvcGllcyB0aGUgbWV0YSBkZXNjcmlwdGlvbiBmb3IgdGhlIGhvbWVwYWdlXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0ZnVuY3Rpb24gd3BzZW9Db3B5SG9tZU1ldGEoKSB7XG5cdFx0alF1ZXJ5KCBcIiNvZ19mcm9udHBhZ2VfZGVzY1wiICkudmFsKCBqUXVlcnkoIFwiI21ldGFfZGVzY3JpcHRpb25cIiApLnZhbCgpICk7XG5cdH1cblxuXHQvKipcblx0ICogTWFrZXMgc3VyZSB3ZSBzdG9yZSB0aGUgYWN0aW9uIGhhc2ggc28gd2UgY2FuIHJldHVybiB0byB0aGUgcmlnaHQgaGFzaFxuXHQgKlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGZ1bmN0aW9uIHdwc2VvU2V0VGFiSGFzaCgpIHtcblx0XHR2YXIgY29uZiA9IGpRdWVyeSggXCIjd3BzZW8tY29uZlwiICk7XG5cdFx0aWYgKCBjb25mLmxlbmd0aCApIHtcblx0XHRcdHZhciBjdXJyZW50VXJsID0gY29uZi5hdHRyKCBcImFjdGlvblwiICkuc3BsaXQoIFwiI1wiIClbIDAgXTtcblx0XHRcdGNvbmYuYXR0ciggXCJhY3Rpb25cIiwgY3VycmVudFVybCArIHdpbmRvdy5sb2NhdGlvbi5oYXNoICk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIFdoZW4gdGhlIGhhc2ggY2hhbmdlcywgZ2V0IHRoZSBiYXNlIHVybCBmcm9tIHRoZSBhY3Rpb24gYW5kIHRoZW4gYWRkIHRoZSBjdXJyZW50IGhhc2hcblx0ICovXG5cdGpRdWVyeSggd2luZG93ICkub24oIFwiaGFzaGNoYW5nZVwiLCB3cHNlb1NldFRhYkhhc2ggKTtcblxuXHQvKipcblx0ICogQWRkIGEgRmFjZWJvb2sgYWRtaW4gZm9yIHZpYSBBSkFYLlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGZ1bmN0aW9uIHdwc2VvQWRkRmJBZG1pbigpIHtcblx0XHR2YXIgdGFyZ2V0Rm9ybSA9IGpRdWVyeSggXCIjVEJfYWpheENvbnRlbnRcIiApO1xuXG5cdFx0alF1ZXJ5LnBvc3QoXG5cdFx0XHRhamF4dXJsLFxuXHRcdFx0e1xuXHRcdFx0XHRfd3Bub25jZTogdGFyZ2V0Rm9ybS5maW5kKCBcImlucHV0W25hbWU9ZmJfYWRtaW5fbm9uY2VdXCIgKS52YWwoKSxcblx0XHRcdFx0YWRtaW5fbmFtZTogdGFyZ2V0Rm9ybS5maW5kKCBcImlucHV0W25hbWU9ZmJfYWRtaW5fbmFtZV1cIiApLnZhbCgpLFxuXHRcdFx0XHRhZG1pbl9pZDogdGFyZ2V0Rm9ybS5maW5kKCBcImlucHV0W25hbWU9ZmJfYWRtaW5faWRdXCIgKS52YWwoKSxcblx0XHRcdFx0YWN0aW9uOiBcIndwc2VvX2FkZF9mYl9hZG1pblwiLFxuXHRcdFx0fSxcblx0XHRcdGZ1bmN0aW9uKCByZXNwb25zZSApIHtcblx0XHRcdFx0dmFyIHJlc3AgPSBqUXVlcnkucGFyc2VKU09OKCByZXNwb25zZSApO1xuXG5cdFx0XHRcdHRhcmdldEZvcm0uZmluZCggXCJwLm5vdGljZVwiICkucmVtb3ZlKCk7XG5cblx0XHRcdFx0c3dpdGNoICggcmVzcC5zdWNjZXNzICkge1xuXHRcdFx0XHRcdGNhc2UgMTpcblxuXHRcdFx0XHRcdFx0dGFyZ2V0Rm9ybS5maW5kKCBcImlucHV0W3R5cGU9dGV4dF1cIiApLnZhbCggXCJcIiApO1xuXG5cdFx0XHRcdFx0XHRqUXVlcnkoIFwiI3VzZXJfYWRtaW5cIiApLmFwcGVuZCggcmVzcC5odG1sICk7XG5cdFx0XHRcdFx0XHRqUXVlcnkoIFwiI2Nvbm5lY3RlZF9mYl9hZG1pbnNcIiApLnNob3coKTtcblx0XHRcdFx0XHRcdHRiX3JlbW92ZSgpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSAwIDpcblx0XHRcdFx0XHRcdHRhcmdldEZvcm0uZmluZCggXCIuZm9ybS13cmFwXCIgKS5wcmVwZW5kKCByZXNwLmh0bWwgKTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBBZGRzIHNlbGVjdDIgZm9yIHNlbGVjdGVkIGZpZWxkcy5cblx0ICpcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRmdW5jdGlvbiBpbml0U2VsZWN0MigpIHtcblx0XHR2YXIgc2VsZWN0MldpZHRoID0gXCI0MDBweFwiO1xuXG5cdFx0Ly8gU2VsZWN0MiBmb3IgR2VuZXJhbCBzZXR0aW5nczogeW91ciBpbmZvOiBjb21wYW55IG9yIHBlcnNvbi4gV2lkdGggaXMgdGhlIHNhbWUgYXMgdGhlIHdpZHRoIGZvciB0aGUgb3RoZXIgZmllbGRzIG9uIHRoaXMgcGFnZS5cblx0XHRqUXVlcnkoIFwiI2NvbXBhbnlfb3JfcGVyc29uXCIgKS5zZWxlY3QyKCB7XG5cdFx0XHR3aWR0aDogc2VsZWN0MldpZHRoLFxuXHRcdFx0bGFuZ3VhZ2U6IHdwc2VvU2VsZWN0MkxvY2FsZSxcblx0XHR9ICk7XG5cblx0XHQvLyBTZWxlY3QyIGZvciBUd2l0dGVyIGNhcmQgbWV0YSBkYXRhIGluIFNldHRpbmdzXG5cdFx0alF1ZXJ5KCBcIiN0d2l0dGVyX2NhcmRfdHlwZVwiICkuc2VsZWN0Migge1xuXHRcdFx0d2lkdGg6IHNlbGVjdDJXaWR0aCxcblx0XHRcdGxhbmd1YWdlOiB3cHNlb1NlbGVjdDJMb2NhbGUsXG5cdFx0fSApO1xuXG5cdFx0Ly8gU2VsZWN0MiBmb3IgdGF4b25vbXkgYnJlYWRjcnVtYnMgaW4gQWR2YW5jZWRcblx0XHRqUXVlcnkoIFwiI3Bvc3RfdHlwZXMtcG9zdC1tYWludGF4XCIgKS5zZWxlY3QyKCB7XG5cdFx0XHR3aWR0aDogc2VsZWN0MldpZHRoLFxuXHRcdFx0bGFuZ3VhZ2U6IHdwc2VvU2VsZWN0MkxvY2FsZSxcblx0XHR9ICk7XG5cblx0XHQvLyBTZWxlY3QyIGZvciBwcm9maWxlIGluIFNlYXJjaCBDb25zb2xlXG5cdFx0alF1ZXJ5KCBcIiNwcm9maWxlXCIgKS5zZWxlY3QyKCB7XG5cdFx0XHR3aWR0aDogc2VsZWN0MldpZHRoLFxuXHRcdFx0bGFuZ3VhZ2U6IHdwc2VvU2VsZWN0MkxvY2FsZSxcblx0XHR9ICk7XG5cdH1cblxuXHQvKipcblx0ICogU2V0IHRoZSBpbml0aWFsIGFjdGl2ZSB0YWIgaW4gdGhlIHNldHRpbmdzIHBhZ2VzLlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGZ1bmN0aW9uIHNldEluaXRpYWxBY3RpdmVUYWIoKSB7XG5cdFx0dmFyIGFjdGl2ZVRhYklkID0gd2luZG93LmxvY2F0aW9uLmhhc2gucmVwbGFjZSggXCIjdG9wI1wiLCBcIlwiICk7XG5cdFx0LyogSW4gc29tZSBjYXNlcywgdGhlIHNlY29uZCAjIGdldHMgcmVwbGFjZSBieSAlMjMsIHdoaWNoIG1ha2VzIHRoZSB0YWJcblx0XHQgKiBzd2l0Y2hpbmcgbm90IHdvcmsgdW5sZXNzIHdlIGRvIHRoaXMuICovXG5cdFx0aWYgKCBhY3RpdmVUYWJJZC5zZWFyY2goIFwiI3RvcFwiICkgIT09IC0xICkge1xuXHRcdFx0YWN0aXZlVGFiSWQgPSB3aW5kb3cubG9jYXRpb24uaGFzaC5yZXBsYWNlKCBcIiN0b3AlMjNcIiwgXCJcIiApO1xuXHRcdH1cblx0XHQvKlxuXHRcdCAqIFdvcmRQcmVzcyB1c2VzIGZyYWdtZW50IGlkZW50aWZpZXJzIGZvciBpdHMgb3duIGluLXBhZ2UgbGlua3MsIGUuZy5cblx0XHQgKiBgI3dwYm9keS1jb250ZW50YCBhbmQgb3RoZXIgcGx1Z2lucyBtYXkgZG8gdGhhdCBhcyB3ZWxsLiBBbHNvLCBmYWNlYm9va1xuXHRcdCAqIGFkZHMgYSBgI189X2Agc2VlIFBSIDUwNi4gSW4gdGhlc2UgY2FzZXMgYW5kIHdoZW4gaXQncyBlbXB0eSwgZGVmYXVsdFxuXHRcdCAqIHRvIHRoZSBmaXJzdCB0YWIuXG5cdFx0ICovXG5cdFx0aWYgKCBcIlwiID09PSBhY3RpdmVUYWJJZCB8fCBcIiNcIiA9PT0gYWN0aXZlVGFiSWQuY2hhckF0KCAwICkgKSB7XG5cdFx0XHQvKlxuXHRcdFx0ICogUmVtaW5kZXI6IGpRdWVyeSBhdHRyKCkgZ2V0cyB0aGUgYXR0cmlidXRlIHZhbHVlIGZvciBvbmx5IHRoZSBmaXJzdFxuXHRcdFx0ICogZWxlbWVudCBpbiB0aGUgbWF0Y2hlZCBzZXQgc28gdGhpcyB3aWxsIGFsd2F5cyBiZSB0aGUgZmlyc3QgdGFiIGlkLlxuXHRcdFx0ICovXG5cdFx0XHRhY3RpdmVUYWJJZCA9IGpRdWVyeSggXCIud3BzZW90YWJcIiApLmF0dHIoIFwiaWRcIiApO1xuXHRcdH1cblxuXHRcdGpRdWVyeSggXCIjXCIgKyBhY3RpdmVUYWJJZCApLmFkZENsYXNzKCBcImFjdGl2ZVwiICk7XG5cdFx0alF1ZXJ5KCBcIiNcIiArIGFjdGl2ZVRhYklkICsgXCItdGFiXCIgKS5hZGRDbGFzcyggXCJuYXYtdGFiLWFjdGl2ZVwiICkuY2xpY2soKTtcblx0fVxuXG5cdHdpbmRvdy53cHNlb0RldGVjdFdyb25nVmFyaWFibGVzID0gd3BzZW9EZXRlY3RXcm9uZ1ZhcmlhYmxlcztcblx0d2luZG93LnNldFdQT3B0aW9uID0gc2V0V1BPcHRpb247XG5cdHdpbmRvdy53cHNlb0NvcHlIb21lTWV0YSA9IHdwc2VvQ29weUhvbWVNZXRhO1xuXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcblx0d2luZG93Lndwc2VvQWRkRmJBZG1pbiA9IHdwc2VvQWRkRmJBZG1pbjtcblx0d2luZG93Lndwc2VvX2FkZF9mYl9hZG1pbiA9IHdwc2VvQWRkRmJBZG1pbjtcblx0d2luZG93Lndwc2VvU2V0VGFiSGFzaCA9IHdwc2VvU2V0VGFiSGFzaDtcblxuXHRqUXVlcnkoIGRvY3VtZW50ICkucmVhZHkoIGZ1bmN0aW9uKCkge1xuXHRcdC8qKlxuXHRcdCAqIFdoZW4gdGhlIGhhc2ggY2hhbmdlcywgZ2V0IHRoZSBiYXNlIHVybCBmcm9tIHRoZSBhY3Rpb24gYW5kIHRoZW4gYWRkIHRoZSBjdXJyZW50IGhhc2guXG5cdFx0ICovXG5cdFx0d3BzZW9TZXRUYWJIYXNoKCk7XG5cblx0XHQvLyBUb2dnbGUgdGhlIEF1dGhvciBhcmNoaXZlcyBzZWN0aW9uLlxuXHRcdGpRdWVyeSggXCIjZGlzYWJsZS1hdXRob3IgaW5wdXRbdHlwZT0ncmFkaW8nXVwiICkuY2hhbmdlKCBmdW5jdGlvbigpIHtcblx0XHRcdC8vIFRoZSB2YWx1ZSBvbiBpcyBkaXNhYmxlZCwgb2ZmIGlzIGVuYWJsZWQuXG5cdFx0XHRpZiAoIGpRdWVyeSggdGhpcyApLmlzKCBcIjpjaGVja2VkXCIgKSApIHtcblx0XHRcdFx0alF1ZXJ5KCBcIiNhdXRob3ItYXJjaGl2ZXMtdGl0bGVzLW1ldGFzLWNvbnRlbnRcIiApLnRvZ2dsZSggalF1ZXJ5KCB0aGlzICkudmFsKCkgPT09IFwib2ZmXCIgKTtcblx0XHRcdH1cblx0XHR9ICkuY2hhbmdlKCk7XG5cblx0XHQvLyBUb2dnbGUgdGhlIERhdGUgYXJjaGl2ZXMgc2VjdGlvbi5cblx0XHRqUXVlcnkoIFwiI2Rpc2FibGUtZGF0ZSBpbnB1dFt0eXBlPSdyYWRpbyddXCIgKS5jaGFuZ2UoIGZ1bmN0aW9uKCkge1xuXHRcdFx0Ly8gVGhlIHZhbHVlIG9uIGlzIGRpc2FibGVkLCBvZmYgaXMgZW5hYmxlZC5cblx0XHRcdGlmICggalF1ZXJ5KCB0aGlzICkuaXMoIFwiOmNoZWNrZWRcIiApICkge1xuXHRcdFx0XHRqUXVlcnkoIFwiI2RhdGUtYXJjaGl2ZXMtdGl0bGVzLW1ldGFzLWNvbnRlbnRcIiApLnRvZ2dsZSggalF1ZXJ5KCB0aGlzICkudmFsKCkgPT09IFwib2ZmXCIgKTtcblx0XHRcdH1cblx0XHR9ICkuY2hhbmdlKCk7XG5cblx0XHQvLyBUb2dnbGUgdGhlIE1lZGlhIHNlY3Rpb24uXG5cdFx0alF1ZXJ5KCBcIiNkaXNhYmxlLWF0dGFjaG1lbnQgaW5wdXRbdHlwZT0ncmFkaW8nXVwiICkuY2hhbmdlKCBmdW5jdGlvbigpIHtcblx0XHRcdC8vIFRoZSB2YWx1ZSBvbiBpcyBkaXNhYmxlZCwgb2ZmIGlzIGVuYWJsZWQuXG5cdFx0XHRpZiAoIGpRdWVyeSggdGhpcyApLmlzKCBcIjpjaGVja2VkXCIgKSApIHtcblx0XHRcdFx0alF1ZXJ5KCBcIiNtZWRpYV9zZXR0aW5nc1wiICkudG9nZ2xlKCBqUXVlcnkoIHRoaXMgKS52YWwoKSA9PT0gXCJvZmZcIiApO1xuXHRcdFx0fVxuXHRcdH0gKS5jaGFuZ2UoKTtcblxuXHRcdC8vIFRvZ2dsZSB0aGUgRm9ybWF0LWJhc2VkIGFyY2hpdmVzIHNlY3Rpb24uXG5cdFx0alF1ZXJ5KCBcIiNkaXNhYmxlLXBvc3RfZm9ybWF0XCIgKS5jaGFuZ2UoIGZ1bmN0aW9uKCkge1xuXHRcdFx0alF1ZXJ5KCBcIiNwb3N0X2Zvcm1hdC10aXRsZXMtbWV0YXNcIiApLnRvZ2dsZSggalF1ZXJ5KCB0aGlzICkuaXMoIFwiOm5vdCg6Y2hlY2tlZClcIiApICk7XG5cdFx0fSApLmNoYW5nZSgpO1xuXG5cdFx0Ly8gVG9nZ2xlIHRoZSBCcmVhZGNydW1icyBzZWN0aW9uLlxuXHRcdGpRdWVyeSggXCIjYnJlYWRjcnVtYnMtZW5hYmxlXCIgKS5jaGFuZ2UoIGZ1bmN0aW9uKCkge1xuXHRcdFx0alF1ZXJ5KCBcIiNicmVhZGNydW1ic2luZm9cIiApLnRvZ2dsZSggalF1ZXJ5KCB0aGlzICkuaXMoIFwiOmNoZWNrZWRcIiApICk7XG5cdFx0fSApLmNoYW5nZSgpO1xuXG5cdFx0Ly8gSGFuZGxlIHRoZSBzZXR0aW5ncyBwYWdlcyB0YWJzLlxuXHRcdGpRdWVyeSggXCIjd3BzZW8tdGFic1wiICkuZmluZCggXCJhXCIgKS5jbGljayggZnVuY3Rpb24oKSB7XG5cdFx0XHRqUXVlcnkoIFwiI3dwc2VvLXRhYnNcIiApLmZpbmQoIFwiYVwiICkucmVtb3ZlQ2xhc3MoIFwibmF2LXRhYi1hY3RpdmVcIiApO1xuXHRcdFx0alF1ZXJ5KCBcIi53cHNlb3RhYlwiICkucmVtb3ZlQ2xhc3MoIFwiYWN0aXZlXCIgKTtcblxuXHRcdFx0dmFyIGlkID0galF1ZXJ5KCB0aGlzICkuYXR0ciggXCJpZFwiICkucmVwbGFjZSggXCItdGFiXCIsIFwiXCIgKTtcblx0XHRcdHZhciBhY3RpdmVUYWIgPSBqUXVlcnkoIFwiI1wiICsgaWQgKTtcblx0XHRcdGFjdGl2ZVRhYi5hZGRDbGFzcyggXCJhY3RpdmVcIiApO1xuXHRcdFx0alF1ZXJ5KCB0aGlzICkuYWRkQ2xhc3MoIFwibmF2LXRhYi1hY3RpdmVcIiApO1xuXHRcdFx0aWYgKCBhY3RpdmVUYWIuaGFzQ2xhc3MoIFwibm9zYXZlXCIgKSApIHtcblx0XHRcdFx0alF1ZXJ5KCBcIiNzdWJtaXRcIiApLmhpZGUoKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGpRdWVyeSggXCIjc3VibWl0XCIgKS5zaG93KCk7XG5cdFx0XHR9XG5cdFx0fSApO1xuXG5cdFx0Ly8gSGFuZGxlIHRoZSBDb21wYW55IG9yIFBlcnNvbiBzZWxlY3QuXG5cdFx0alF1ZXJ5KCBcIiNjb21wYW55X29yX3BlcnNvblwiICkuY2hhbmdlKCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBjb21wYW55T3JQZXJzb24gPSBqUXVlcnkoIHRoaXMgKS52YWwoKTtcblx0XHRcdGlmICggXCJjb21wYW55XCIgPT09IGNvbXBhbnlPclBlcnNvbiApIHtcblx0XHRcdFx0alF1ZXJ5KCBcIiNrbm93bGVkZ2UtZ3JhcGgtY29tcGFueVwiICkuc2hvdygpO1xuXHRcdFx0XHRqUXVlcnkoIFwiI2tub3dsZWRnZS1ncmFwaC1wZXJzb25cIiApLmhpZGUoKTtcblx0XHRcdH1cblx0XHRcdGVsc2UgaWYgKCBcInBlcnNvblwiID09PSBjb21wYW55T3JQZXJzb24gKSB7XG5cdFx0XHRcdGpRdWVyeSggXCIja25vd2xlZGdlLWdyYXBoLWNvbXBhbnlcIiApLmhpZGUoKTtcblx0XHRcdFx0alF1ZXJ5KCBcIiNrbm93bGVkZ2UtZ3JhcGgtcGVyc29uXCIgKS5zaG93KCk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0alF1ZXJ5KCBcIiNrbm93bGVkZ2UtZ3JhcGgtY29tcGFueVwiICkuaGlkZSgpO1xuXHRcdFx0XHRqUXVlcnkoIFwiI2tub3dsZWRnZS1ncmFwaC1wZXJzb25cIiApLmhpZGUoKTtcblx0XHRcdH1cblx0XHR9ICkuY2hhbmdlKCk7XG5cblx0XHQvLyBDaGVjayBjb3JyZWN0IHZhcmlhYmxlcyB1c2FnZSBpbiB0aXRsZSBhbmQgZGVzY3JpcHRpb24gdGVtcGxhdGVzLlxuXHRcdGpRdWVyeSggXCIudGVtcGxhdGVcIiApLmNoYW5nZSggZnVuY3Rpb24oKSB7XG5cdFx0XHR3cHNlb0RldGVjdFdyb25nVmFyaWFibGVzKCBqUXVlcnkoIHRoaXMgKSApO1xuXHRcdH0gKS5jaGFuZ2UoKTtcblxuXHRcdC8vIFByZXZlbnQgZm9ybSBzdWJtaXNzaW9uIHdoZW4gcHJlc3NpbmcgRW50ZXIgb24gdGhlIHN3aXRjaC10b2dnbGVzLlxuXHRcdGpRdWVyeSggXCIuc3dpdGNoLXlvYXN0LXNlbyBpbnB1dFwiICkub24oIFwia2V5ZG93blwiLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRpZiAoIFwia2V5ZG93blwiID09PSBldmVudC50eXBlICYmIDEzID09PSBldmVudC53aGljaCApIHtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdH1cblx0XHR9ICk7XG5cblx0XHRzZXRJbml0aWFsQWN0aXZlVGFiKCk7XG5cdFx0aW5pdFNlbGVjdDIoKTtcblx0fSApO1xufSgpICk7XG4iLCJ2YXIgY29udGFpbmVyUG9saXRlLCBjb250YWluZXJBc3NlcnRpdmUsIHByZXZpb3VzTWVzc2FnZSA9IFwiXCI7XG5cbi8qKlxuICogQnVpbGQgdGhlIGxpdmUgcmVnaW9ucyBtYXJrdXAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGFyaWFMaXZlIE9wdGlvbmFsLiBWYWx1ZSBmb3IgdGhlIFwiYXJpYS1saXZlXCIgYXR0cmlidXRlLCBkZWZhdWx0IFwicG9saXRlXCIuXG4gKlxuICogQHJldHVybnMge09iamVjdH0gJGNvbnRhaW5lciBUaGUgQVJJQSBsaXZlIHJlZ2lvbiBqUXVlcnkgb2JqZWN0LlxuICovXG52YXIgYWRkQ29udGFpbmVyID0gZnVuY3Rpb24oIGFyaWFMaXZlICkge1xuXHRhcmlhTGl2ZSA9IGFyaWFMaXZlIHx8IFwicG9saXRlXCI7XG5cblx0dmFyIGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoIFwiZGl2XCIgKTtcblx0Y29udGFpbmVyLmlkID0gXCJhMTF5LXNwZWFrLVwiICsgYXJpYUxpdmU7XG5cdGNvbnRhaW5lci5jbGFzc05hbWUgPSBcImExMXktc3BlYWstcmVnaW9uXCI7XG5cblx0dmFyIHNjcmVlblJlYWRlclRleHRTdHlsZSA9IFwiY2xpcDogcmVjdCgxcHgsIDFweCwgMXB4LCAxcHgpOyBwb3NpdGlvbjogYWJzb2x1dGU7IGhlaWdodDogMXB4OyB3aWR0aDogMXB4OyBvdmVyZmxvdzogaGlkZGVuOyB3b3JkLXdyYXA6IG5vcm1hbDtcIjtcblx0Y29udGFpbmVyLnNldEF0dHJpYnV0ZSggXCJzdHlsZVwiLCBzY3JlZW5SZWFkZXJUZXh0U3R5bGUgKTtcblxuXHRjb250YWluZXIuc2V0QXR0cmlidXRlKCBcImFyaWEtbGl2ZVwiLCBhcmlhTGl2ZSApO1xuXHRjb250YWluZXIuc2V0QXR0cmlidXRlKCBcImFyaWEtcmVsZXZhbnRcIiwgXCJhZGRpdGlvbnMgdGV4dFwiICk7XG5cdGNvbnRhaW5lci5zZXRBdHRyaWJ1dGUoIFwiYXJpYS1hdG9taWNcIiwgXCJ0cnVlXCIgKTtcblxuXHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCBcImJvZHlcIiApLmFwcGVuZENoaWxkKCBjb250YWluZXIgKTtcblx0cmV0dXJuIGNvbnRhaW5lcjtcbn07XG5cbi8qKlxuICogU3BlY2lmeSBhIGZ1bmN0aW9uIHRvIGV4ZWN1dGUgd2hlbiB0aGUgRE9NIGlzIGZ1bGx5IGxvYWRlZC5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayBBIGZ1bmN0aW9uIHRvIGV4ZWN1dGUgYWZ0ZXIgdGhlIERPTSBpcyByZWFkeS5cbiAqXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xudmFyIGRvbVJlYWR5ID0gZnVuY3Rpb24oIGNhbGxiYWNrICkge1xuXHRpZiAoIGRvY3VtZW50LnJlYWR5U3RhdGUgPT09IFwiY29tcGxldGVcIiB8fCAoIGRvY3VtZW50LnJlYWR5U3RhdGUgIT09IFwibG9hZGluZ1wiICYmICFkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuZG9TY3JvbGwgKSApIHtcblx0XHRyZXR1cm4gY2FsbGJhY2soKTtcblx0fVxuXG5cdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoIFwiRE9NQ29udGVudExvYWRlZFwiLCBjYWxsYmFjayApO1xufTtcblxuLyoqXG4gKiBDcmVhdGUgdGhlIGxpdmUgcmVnaW9ucyB3aGVuIHRoZSBET00gaXMgZnVsbHkgbG9hZGVkLlxuICovXG5kb21SZWFkeSggZnVuY3Rpb24oKSB7XG5cdGNvbnRhaW5lclBvbGl0ZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCBcImExMXktc3BlYWstcG9saXRlXCIgKTtcblx0Y29udGFpbmVyQXNzZXJ0aXZlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoIFwiYTExeS1zcGVhay1hc3NlcnRpdmVcIiApO1xuXG5cdGlmICggY29udGFpbmVyUG9saXRlID09PSBudWxsICkge1xuXHRcdGNvbnRhaW5lclBvbGl0ZSA9IGFkZENvbnRhaW5lciggXCJwb2xpdGVcIiApO1xuXHR9XG5cdGlmICggY29udGFpbmVyQXNzZXJ0aXZlID09PSBudWxsICkge1xuXHRcdGNvbnRhaW5lckFzc2VydGl2ZSA9IGFkZENvbnRhaW5lciggXCJhc3NlcnRpdmVcIiApO1xuXHR9XG59ICk7XG5cbi8qKlxuICogQ2xlYXIgdGhlIGxpdmUgcmVnaW9ucy5cbiAqL1xudmFyIGNsZWFyID0gZnVuY3Rpb24oKSB7XG5cdHZhciByZWdpb25zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCggXCIuYTExeS1zcGVhay1yZWdpb25cIiApO1xuXHRmb3IgKCB2YXIgaSA9IDA7IGkgPCByZWdpb25zLmxlbmd0aDsgaSsrICkge1xuXHRcdHJlZ2lvbnNbIGkgXS50ZXh0Q29udGVudCA9IFwiXCI7XG5cdH1cbn07XG5cbi8qKlxuICogVXBkYXRlIHRoZSBBUklBIGxpdmUgbm90aWZpY2F0aW9uIGFyZWEgdGV4dCBub2RlLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBtZXNzYWdlICBUaGUgbWVzc2FnZSB0byBiZSBhbm5vdW5jZWQgYnkgQXNzaXN0aXZlIFRlY2hub2xvZ2llcy5cbiAqIEBwYXJhbSB7U3RyaW5nfSBhcmlhTGl2ZSBPcHRpb25hbC4gVGhlIHBvbGl0ZW5lc3MgbGV2ZWwgZm9yIGFyaWEtbGl2ZS4gUG9zc2libGUgdmFsdWVzOlxuICogICAgICAgICAgICAgICAgICAgICAgICAgIHBvbGl0ZSBvciBhc3NlcnRpdmUuIERlZmF1bHQgcG9saXRlLlxuICovXG52YXIgQTExeVNwZWFrID0gZnVuY3Rpb24oIG1lc3NhZ2UsIGFyaWFMaXZlICkge1xuXHQvLyBDbGVhciBwcmV2aW91cyBtZXNzYWdlcyB0byBhbGxvdyByZXBlYXRlZCBzdHJpbmdzIGJlaW5nIHJlYWQgb3V0LlxuXHRjbGVhcigpO1xuXG5cdC8qXG5cdCAqIFN0cmlwIEhUTUwgdGFncyAoaWYgYW55KSBmcm9tIHRoZSBtZXNzYWdlIHN0cmluZy4gSWRlYWxseSwgbWVzc2FnZXMgc2hvdWxkXG5cdCAqIGJlIHNpbXBsZSBzdHJpbmdzLCBjYXJlZnVsbHkgY3JhZnRlZCBmb3Igc3BlY2lmaWMgdXNlIHdpdGggQTExeVNwZWFrLlxuXHQgKiBXaGVuIHJlLXVzaW5nIGFscmVhZHkgZXhpc3Rpbmcgc3RyaW5ncyB0aGlzIHdpbGwgZW5zdXJlIHNpbXBsZSBIVE1MIHRvIGJlXG5cdCAqIHN0cmlwcGVkIG91dCBhbmQgcmVwbGFjZWQgd2l0aCBhIHNwYWNlLiBCcm93c2VycyB3aWxsIGNvbGxhcHNlIG11bHRpcGxlXG5cdCAqIHNwYWNlcyBuYXRpdmVseS5cblx0ICovXG5cdG1lc3NhZ2UgPSBtZXNzYWdlLnJlcGxhY2UoIC88W148Pl0rPi9nLCBcIiBcIiApO1xuXG5cdGlmICggcHJldmlvdXNNZXNzYWdlID09PSBtZXNzYWdlICkge1xuXHRcdG1lc3NhZ2UgPSBtZXNzYWdlICsgXCJcXHUwMEEwXCI7XG5cdH1cblxuXHRwcmV2aW91c01lc3NhZ2UgPSBtZXNzYWdlO1xuXG5cdGlmICggY29udGFpbmVyQXNzZXJ0aXZlICYmIFwiYXNzZXJ0aXZlXCIgPT09IGFyaWFMaXZlICkge1xuXHRcdGNvbnRhaW5lckFzc2VydGl2ZS50ZXh0Q29udGVudCA9IG1lc3NhZ2U7XG5cdH0gZWxzZSBpZiAoIGNvbnRhaW5lclBvbGl0ZSApIHtcblx0XHRjb250YWluZXJQb2xpdGUudGV4dENvbnRlbnQgPSBtZXNzYWdlO1xuXHR9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEExMXlTcGVhaztcbiJdfQ==
