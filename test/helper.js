const assert = require('assert');
const FlyJsonQL = require('../src/flyjsonql');
const jsonql = new FlyJsonQL();

describe('helper test', function() {
    it('is string', function() {
        assert.equal(jsonql._odm.isString('abc'),true);
        assert.equal(jsonql._odm.isString(''),true);
        assert.equal(jsonql._odm.isString(1),false);
        assert.equal(jsonql._odm.isString([]),false);
        assert.equal(jsonql._odm.isString({}),false);
    });

    it('is integer', function() {
        assert.equal(jsonql._odm.isInteger(1),true);
        assert.equal(jsonql._odm.isInteger(0),true);
        assert.equal(jsonql._odm.isInteger(-1),true);
        assert.equal(jsonql._odm.isInteger(-1.56),false);
        assert.equal(jsonql._odm.isInteger(1.56),false);
        assert.equal(jsonql._odm.isInteger('2'),false);
        assert.equal(jsonql._odm.isInteger('-2'),false);
        assert.equal(jsonql._odm.isInteger('02'),false);
        assert.equal(jsonql._odm.isInteger('2.56'),false);
        assert.equal(jsonql._odm.isInteger('-2.56'),false);
        assert.equal(jsonql._odm.isInteger([1,2,3]),false);
        assert.equal(jsonql._odm.isInteger([]),false);
        assert.equal(jsonql._odm.isInteger({}),false);
        assert.equal(jsonql._odm.isInteger(''),false);
    });

    it('is boolean', function() {
        assert.equal(jsonql._odm.isBoolean(true),true);
        assert.equal(jsonql._odm.isBoolean(false),true);
        assert.equal(jsonql._odm.isBoolean(new Boolean(true)),true);
        assert.equal(jsonql._odm.isBoolean(new Boolean(false)),true);
        assert.equal(jsonql._odm.isBoolean(1),false);
        assert.equal(jsonql._odm.isBoolean(0),false);
        assert.equal(jsonql._odm.isBoolean('true'),false);
        assert.equal(jsonql._odm.isBoolean('false'),false);
    });

    it('is array', function() {
        assert.equal(jsonql._odm.isArray([1,2,3]),true);
        assert.equal(jsonql._odm.isArray([]),true);
        assert.equal(jsonql._odm.isArray({}),false);
        assert.equal(jsonql._odm.isArray(''),false);
        assert.equal(jsonql._odm.isArray(1),false);
    });

    it('is object', function() {
        assert.equal(jsonql._odm.isObject({id:1,name:'abc'}),true);
        assert.equal(jsonql._odm.isObject({}),true);
        assert.equal(jsonql._odm.isObject([]),false);
        assert.equal(jsonql._odm.isObject(''),false);
        assert.equal(jsonql._odm.isObject(1),false);
    });

    it('is empty string', function() {
        assert.equal(jsonql._odm.isEmpty(undefined),true);
        assert.equal(jsonql._odm.isEmpty(null),true);
        assert.equal(jsonql._odm.isEmpty(''),true);
        assert.equal(jsonql._odm.isEmpty('abc'),false);
        assert.equal(jsonql._odm.isEmpty(1),false);
        assert.equal(jsonql._odm.isEmpty([]),false);
        assert.equal(jsonql._odm.isEmpty({}),false);
    });

    it('is empty array', function() {
        assert.equal(jsonql._odm.isEmptyArray(undefined),true);
        assert.equal(jsonql._odm.isEmptyArray(null),true);
        assert.equal(jsonql._odm.isEmptyArray([]),true);
        assert.equal(jsonql._odm.isEmptyArray({}),false);
        assert.equal(jsonql._odm.isEmptyArray({id:1}),false);
        assert.equal(jsonql._odm.isEmptyArray('1'),false);
        assert.equal(jsonql._odm.isEmptyArray(1),false);
        assert.equal(jsonql._odm.isEmptyArray([1,2,3]),false);
    });

    it('is empty object', function() {
        assert.equal(jsonql._odm.isEmptyObject(undefined),true);
        assert.equal(jsonql._odm.isEmptyObject(null),true);
        assert.equal(jsonql._odm.isEmptyObject({}),true);
        assert.equal(jsonql._odm.isEmptyObject([]),false);
        assert.equal(jsonql._odm.isEmptyObject(1),false);
        assert.equal(jsonql._odm.isEmptyObject({id:1}),false);
        assert.equal(jsonql._odm.isEmptyObject('1'),false);
        assert.equal(jsonql._odm.isEmptyObject([1,2,3]),false);
    });

    it('is empty object parameter value must hasOwnProperty',function(){
        const obj = Object.create({name: 'inherited'});
        assert.equal(true,jsonql._odm.isEmptyObject(obj));
    });

});