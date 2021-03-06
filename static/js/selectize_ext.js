define('selectize_ext', ['jquery', 'selectize'], function ($, selectize) {
    selectize.define('apple_patch', function (options) {
        var self = this;

        this.setup = (function () {
            var original = self.setup;
            return function () {
                original.apply(this, arguments);
                this.$control_input.on('compositionend', function (e) {
                    if (self.isLocked) return e && e.preventDefault();
                    var value = self.$control_input.val() || '';
                    if (self.lastValue !== value) {
                        self.lastValue = value;
                        self.onSearchChange(value);
                        self.refreshOptions();
                        self.trigger('type', value);
                    }
                });
            };
        })();
    });
});