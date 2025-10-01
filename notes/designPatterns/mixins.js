import Events from 'eventemitter3';

const rawMixin = function () {
  const attrs = {};

  return Object.assign(this, {
    set (name, value) {
      attrs[name] = value;

      this.emit('change', {
        prop: name,
        value: value
      });
    },

    get (name) {
      return attrs[name];
    }
  }, Events.prototype);
};

const mixinModel = (target) => rawMixin.call(target);

const george = { name: 'george' };
const model = mixinModel(george);

model.on('change', data => console.log(data));

model.set('name', 'Sam');

// https://medium.com/javascript-scene/3-different-kinds-of-prototypal-inheritance-es6-edition-32d777fa16c9
