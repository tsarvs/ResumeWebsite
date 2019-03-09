var GRID = GRID || {};

GRID = (function() {
  return {
    init: function() {
      this.el = $(".grid");

      this.el
        .find(".grid__item")
        .on("click", $.proxy(this.toggleContent, this));
    },

    closeItems: function(items) {
      items.removeClass("active");
      items.removeAttr("style");
    },

    openItem: function(item, grid) {
      var rows = window.getComputedStyle(grid[0]).gridTemplateRows.split(" "),
        columns = window
          .getComputedStyle(grid[0])
          .gridTemplateColumns.split(" "),
        itemColumn = Math.ceil(
          (item.offset().left - grid.offset().left) *
            columns.length /
            grid.width()
        ),
        itemRow = Math.ceil(
          (item.offset().top - grid.offset().top) * rows.length / grid.height()
        );

      itemColumn = itemColumn >= columns.length ? itemColumn - 1 : itemColumn;
      itemRow = itemRow >= rows.length ? itemRow - 1 : itemRow;

      item.addClass("active");
      item[0].style.gridRowStart = itemRow;
      item[0].style.gridColumnStart = itemColumn;
    },

    toggleContent: function(e) {
      e.preventDefault();

      var view = this,
        item = $(e.currentTarget),
        items = this.el.find(".grid__item");

      item.hasClass("active")
        ? this.closeItems(item)
        : this.openItem(item, this.el);

      this.closeItems(items.not(item));
    }
  };
})();

GRID.init();