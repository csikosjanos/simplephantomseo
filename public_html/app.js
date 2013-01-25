(function($){

  var PagesView = Backbone.View.extend({
    el: 'section',

    nav: false,
    navView: false,

    initialize: function(){
      _.bindAll(this, 'render', 'changePage');
      this.render();
    },

    render: function(){
      $(this.el).html(JST['pages/home']());
      return this;
    },

    changePage: function(page){
      template = ((page.length>0)
        ?((JST['pages/'+page])
          ?JST['pages/'+page]()
          :JST['pages/notfound']())
        :JST['pages/home']());

      $(this.el).html(template);
    }
  });

  var pagesView = new PagesView();

  var AppRouter = Backbone.Router.extend({
    routes: {
      "!*page": "getPage",
      "*page": "getPage"
    }
  });

  var appRouter = new AppRouter;
  appRouter.on('route:getPage', function(page) {
    console.log('page:'+page);
    pagesView.changePage(page);
  });

  Backbone.history.start()

})(jQuery);