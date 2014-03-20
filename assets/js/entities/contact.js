ContactManager.module('Entities', function(Entities, ContactManager, Backbone, Marionette, $, _){

	Entities.Contact = Backbone.Model.extend({
		urlRoot: "contacts",

		validate: function(attrs, options) {
			var errors = {}

			if(! attrs.firstName) {
				errors.firstName = "can't be blank"
			}
			if(! attrs.lastName) {
				errors.lastName = "can't be blank"
			} else {
				if(attrs.lastName.length < 2) {
					errors.lastName = "is to short"
				}
			}
			if(!_.isEmpty(errors)) {
				return errors;
			}
		}
	});

	Entities.configureStorage(Entities.Contact);

	Entities.ContactCollection = Backbone.Collection.extend({

		url: "contacts",

		model: Entities.Contact,

		comparator: function(a, b) {
			var aFirstName = a.get('firstName');
			var bFirstName = b.get('firstName');

			if(aFirstName === bFirstName) {
				var aLastName = a.get('lastName');
				var bLastName = b.get('lastName');
				if (aLastName === bLastName) {
					return 0
				};
				if (aLastName < bLastName) {
					return -1
				} else {
					return 1
				}
			} else {
				if (aFirstName < bFirstName) {
					return -1
				} else {
					return 1
				}
			}
		}
	});

	Entities.configureStorage(Entities.ContactCollection);

	var contacts;

	var initialiazeContacts = function() {
		contacts = new Entities.ContactCollection([
			{
				id: 1,
				firstName: 'Alice',
				lastName: 'Tampen',
				phoneNumber: '555-0983'
			},
			{
				id: 2,
				firstName: 'Alice',
				lastName: 'Arten',
				phoneNumber: '555-0983'
			},
			{
				id: 3,
				firstName: 'Alice',
				lastName: 'Artsy',
				phoneNumber: '555-0983'
			},
			{
				id: 4,
				firstName: 'John',
				lastName: 'Weeks',
				phoneNumber: '555-0482'
			},
			{
				id: 5,
				firstName: 'Jeffrey',
				lastName: 'Way',
				phoneNumber: '534-0235'
			},
			{
				id: 6,
				firstName: 'Douglas',
				lastName: 'Crockford',
				phoneNumber: '231-0453'
			},
		]);

		contacts.forEach(function(contact){
			contact.save();
		});

		return contacts.models;
	};

	var API = {
		getContactEntities: function() {
			var contacts = new Entities.ContactCollection();

			var defer = $.Deferred();

			contacts.fetch({
				success: function (data) {
					defer.resolve(data);
				}
			});

			var promise = defer.promise();

			$.when(promise).done(function(contacts){
				if (contacts.length === 0) {
					var models = initialiazeContacts();
					contacts.reset(models);
				}
			});

			return promise;
		},

		getContactEntity: function(contactId) {
			var contact = new Entities.Contact({
				id: contactId
			});

			var defer = $.Deferred();

			setTimeout(function(){
				contact.fetch({
					success: function(data) {
						defer.resolve(data);
					},
					error: function(data) {
						defer.resolve(undefined);
					}
				});
			}, 500);

			return defer.promise();
		}
	};

	ContactManager.reqres.setHandler("contact:entities", function(){
		return API.getContactEntities();
	});

	ContactManager.reqres.setHandler("contact:entity", function(id){
		return API.getContactEntity(id);
	});
});