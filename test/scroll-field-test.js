var assert = chai.assert;

describe('ScrollField', function () {
    var util = {
        getWindowHeight: function () {
            return (
                window.innerHeight ||
                    document.body.clientHeight ||
                    0
            );
        }
    };
    
    var height, sectionHeight, sections;
    before(function () {
        var counts = 5;
        sectionHeight = util.getWindowHeight();

        height = sectionHeight * counts;
        document.body.style.height = height + 'px';

        sections = [];

        var el;
        for (var i = 0; i < counts; i++) {
            el = document.createElement('div');
            el.style.height = sectionHeight + 'px';
            el.style.position = 'absolute';
            el.style.top = (sectionHeight * i) + 'px';

            document.body.appendChild(el);
            sections.push(el);
        }

        document.body.scrollTop = sectionHeight;
    });

    it('set scroll event', function (done) {
        var scrollField = new ScrollField({
            els: sections,
            throttle: 0
        });

        scrollField.on('spot', function (e) {
            assert.equal(e.el, sections[0]);
            assert.equal(e.cursor, 0);
            done();
        });

        document.body.scrollTop = sectionHeight / 2;
    });
});
