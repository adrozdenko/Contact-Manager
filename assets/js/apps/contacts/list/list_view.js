ContactManager.module("ContactsApp.List", function(List, ContactManager, Backbone, Marionette, $, _){

	List.Contact = Marionette.ItemView.extend({
		tagName: "tr",
		template: "#contact-list-item",

		events: {
			"click": "highlightName",
			"click button.js-show": "showClicked",
			"click a.js-edit": "editClicked",
			"click button.js-delete": "deleteClicked"

		},

		highlightName: function() {
			this.$el.toggleClass("warning");
		},

		showClicked: function(e) {
			e.preventDefault();
			e.stopPropagation();
			this.trigger("contact:show", this.model);
		},

		editClicked: function(e) {
			e.preventDefault();
			e.stopPropagation();
			this.trigger('contact:edit', this.model);
		},

		deleteClicked: function(e) {
			e.stopPropagation();
			this.trigger("contact:delete", this.model);
		},

		remove: function() {
			var self = this;
			this.$el.fadeOut(function(){
				Marionette.ItemView.prototype.remove.call(self);
			});
		},

		flash: function(cssClass) {
			var $view = this.$el;
			$view.hide().toggleClass(cssClass).fadeIn(800, function() {
				setTimeout(function(){
					$view.toggleClass(cssClass);
				}, 500);
			});
		}
	});

	List.Contacts = Marionette.CompositeView.extend({
		tagName: "table",
		className: "table table-hover",
		template: "#contact-list",
		itemView: List.Contact,
		itemViewContainer: "tbody"
	});
});