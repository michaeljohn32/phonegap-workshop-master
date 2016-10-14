var app = {

    showAlert: function (message, title) {
        if (navigator.notification) {
            navigator.notification.alert(message, null, title, 'OK');
        } else {
            alert(title ? (title + ": " + message) : message);
        }
    },


    initialize: function() {
        var self = this;
        this.store = new MemoryStore(function() {
            self.route();
        });
        this.detailsURL = /^#employees\/(\d{1,})/;
        this.homeTpl = Handlebars.compile($("#home-tpl").html());
        this.employeeLiTpl = Handlebars.compile($("#employee-li-tpl").html());
        $('.search-key').on('keyup', $.proxy(this.findByName, this));
        this.registerEvents()
    },

    route: function() {
        var hash = window.location.hash;
        console.log("Hash: " + hash);
        if (!hash) {
            $('body').html(new HomeView(this.store).render().el);
            return;
        }
        var match = hash.match(app.detailsURL);
        console.log("Match: " + match[1]);
        if (match) {
            this.store.findById(Number(match[1]), function(employee) {
                console.log("employee_find: " + employee);
                for (var property in employee){
                   console.log("property: " + property);
                }
                console.log("employeeName: " + employee.firstName);
                $('body').html(new EmployeeView(employee).render().el);
            });
        }
    },

    registerEvents: function() {
        var self = this;
 
        // Add an event listener to listen on URL hash tag changes
        $(window).on('hashchange', $.proxy(this.route, this));

        // Check of browser supports touch events...
        if (document.documentElement.hasOwnProperty('ontouchstart')) {
            // ... if yes: register touch event listener to change the "selected" state of the item
            $('body').on('touchstart', 'a', function(event) {
                $(event.target).addClass('tappable-active');
            });
            $('body').on('touchend', 'a', function(event) {
                $(event.target).removeClass('tappable-active');
            });
        } else {
            // ... if not: register mouse events instead
            $('body').on('mousedown', 'a', function(event) {
                $(event.target).addClass('tappable-active');
            });
            $('body').on('mouseup', 'a', function(event) {
                $(event.target).removeClass('tappable-active');
            });
        }
          
    },
};

app.initialize();
