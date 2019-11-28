const FlyJsonOdm = require('fly-json-odm');

class JsonQL {

    constructor() {
        // Promise Stackholder
        this.promiseStack = [];
        // Result from database
        this.content = [];
        // flyjsonodm
        this._odm = new FlyJsonOdm();
        // joined stack
        this.joined = [];
    }

    /**
     * Get json odm
     * @return {_odm}
     */
    get odm() {
        return this._odm;
    }

    /**
     * Cleanup data in stackholder
     */
    clean() {
        this.content = [];
        this.promiseStack = [];
    }

    _funcBetween(parent,name,valueA,valueB) {
        parent.where(name,'>=',valueA).where(name,'<=',valueB);
    }

    _funcSearch(parent,name,value) {
        parent.where(name,'like',value,false);
    }

    _funcRegExp(parent,name,value) {
        parent.where(name,'regex',value);
    }

    /**
     * builder.where
     * @param {_odm} parent 
     * @param {array} where
     */
    _builderWhere(parent,where,or=false) {
        if(!this._odm.isEmpty(where) && this._odm.isArray(where) && !this._odm.isEmptyArray(where)) {
            for(var i=0;i<where.length;i++) {
                parent.where(...where[i]);
            }
        }
    }

    /**
     * builder.between
     * @param {_odm} parent 
     * @param {array} between
     */
    _builderBetween(parent,between) {
        if(!this._odm.isEmpty(between) && this._odm.isArray(between) && !this._odm.isEmptyArray(between)) {
            for(var i=0;i<between.length;i++) {
                this._funcBetween(parent,...between[i]);
            }
        }
    }

    /**
     * builder.search
     * @param {_odm} parent 
     * @param {array} search
     */
    _builderSearch(parent,search) {
        if(!this._odm.isEmpty(search) && this._odm.isArray(search) && !this._odm.isEmptyArray(search)) {
            for(var i=0;i<search.length;i++) {
                this._funcSearch(parent,...search[i]);
            }
        }
    }

    /**
     * builder.regexp
     * @param {_odm} parent 
     * @param {array} regexp
     */
    _builderRegExp(parent,regexp) {
        if(!this._odm.isEmpty(regexp) && this._odm.isArray(regexp) && !this._odm.isEmptyArray(regexp)) {
            for(var i=0;i<regexp.length;i++) {
                this._funcRegExp(parent,...regexp[i]);
            }
        }
    }

    /**
     * builder.or
     * @param {_odm} parent 
     * @param {object} or
     */
    _builderOr(parent,or) {
        if(!this._odm.isEmpty(or) && this._odm.isArray(or) && !this._odm.isEmptyArray(or)) {
            parent.begin();
            for(var i=0;i<or.length;i++) {
                this._builderBetween(parent,or[i].between);
                this._builderWhere(parent,or[i].where);
                this._builderSearch(parent,or[i].search);
                this._builderRegExp(parent,or[i].regexp);
                if(i !== (or.length-1)) parent.or();
            }
            parent.end();
        }
    }

    /**
     * builder item list for map transform
     * @param {array} table 
     * @return {object}
     */
    _builderItemList(table) {
        var keys = Object.keys(table[0]);
        var result = {};
        for(var i=0;i<keys.length;i++) {
            Object.assign(result,{[keys[i]]:keys[i].toString()});    
        }
        return result;
    }

    /**
     * builder.nested
     * @param {array} table 
     * @param {array} nested 
     * @return {array}
     */
    _builderNested(table,nested) {
        var removed = [...nested];
        removed.shift();
  
        var data = {
        	posts : table
        };

        var map = {
        	list : 'posts',
        	item: this._builderItemList(table),
        	each: function(item){
                var up = null;
                for(var x=1;x<nested.length;x++) {
                    if(up) {
                        up[nested[x]] = item[nested[x]];
                        up = up[nested[x]];    
                    } else {
                        item[nested[0]][nested[x]] = item[nested[x]];
                        up = item[nested[0]][nested[x]];
                    }
                }
                return item;
            },
            defaults: {
                "missingData": true
            },
            remove:removed
        };
        return this._odm.jsonTransform(data, map).make();
    }

    /**
     * builder.fields
     * @param {_odm} parent 
     * @param {array} fields
     */
    _setFields(parent,fields) {
        if(!this._odm.isEmpty(fields) && this._odm.isArray(fields) && !this._odm.isEmptyArray(fields)) {
            parent.select(fields);
        }
    }

    /**
     * builder.groupby
     * @param {_odm} parent 
     * @param {array} groupby
     */
    _setGroupBy(parent,groupby) {
        if(!this._odm.isEmpty(groupby) && this._odm.isArray(groupby) && !this._odm.isEmptyArray(groupby)) {
            parent.groupBy(...groupby);
        }
    }

    /**
     * builder.groupdetail
     * @param {_odm} parent 
     * @param {array} groupdetail
     */
    _setGroupDetail(parent,groupdetail) {
        if(!this._odm.isEmpty(groupdetail) && this._odm.isArray(groupdetail) && !this._odm.isEmptyArray(groupdetail)) {
            parent.groupDetail(...groupdetail);
        }
    }

    /**
     * builder.orderby
     * @param {_odm} parent 
     * @param {array} orderby
     */
    _setOrderBy(parent,orderby) {
        if(!this._odm.isEmpty(orderby) && this._odm.isArray(orderby) && !this._odm.isEmptyArray(orderby)) {
            parent.orderBy(...orderby);
        }
    }

    /**
     * builder.skip
     * @param {_odm} parent 
     * @param {string|integer} skip
     */
    _setSkip(parent,skip) {
        if(!this._odm.isEmpty(skip) && (this._odm.isString(skip) || this._odm.isInteger(skip))) {
            parent.skip(skip);
        }
    }

    /**
     * builder.take
     * @param {_odm} parent 
     * @param {string|integer} take
     */
    _setTake(parent,take) {
        if(!this._odm.isEmpty(take) && (this._odm.isString(take) || this._odm.isInteger(take))) {
            parent.take(take);
        }
    }

    /**
     * builder.paginate
     * @param {_odm} parent 
     * @param {array} paginate
     */
    _setPaginate(parent,paginate) {
        if(!this._odm.isEmpty(paginate) && this._odm.isArray(paginate) && !this._odm.isEmptyArray(paginate)) {
            parent.paginate(...paginate);
        }
    }

    /**
     * Merge Builder 
     * @param {string} scope
     * @param {_odm} parent
     * @param {object} obj 
     */
    _mergeScope(scope,parent,obj) {
        if(!this._odm.isEmpty(obj) && this._odm.isArray(obj) && !this._odm.isEmptyArray(obj)) {
            var len = obj.length;
            var rejoin = [];
            for(var i=0;i<len;i++) {
                // nested join
                if(obj[i].merge){
                    if(this.joined.length == 0) {
                        this.joined.push(parent.join(obj[i].name,obj[i].from).merge(...obj[i].on).exec());
                    } else {
                        for(var x=0;x<this.joined.length;x++) {
                            rejoin.push(parent.set(this.joined[x]).join(obj[i].name,obj[i].from).merge(...obj[i].on).exec());
                        }
                    }
                    this.joined = [...this.joined.concat(rejoin)];
                    this._mergeScope('nested',parent,obj[i].merge);
                } else {
                    if(this.joined.length >0 ) {
                        parent.set(this.joined[(this.joined.length-1)]).join(obj[i].name,obj[i].from).merge(...obj[i].on);
                        this.joined = [];
                    } else {
                        parent.join(obj[i].name,obj[i].from).merge(...obj[i].on);
                    }
                    this._selectScope(scope,parent,obj[i]);
                }
            }
        }
    }

    /**
     * Join Builder 
     * @param {string} scope
     * @param {_odm} parent
     * @param {object} obj 
     */
    _joinScope(scope,parent,obj) {
        if(!this._odm.isEmpty(obj) && this._odm.isArray(obj) && !this._odm.isEmptyArray(obj)) {
            var len = obj.length;
            var rejoin = [];
            for(var i=0;i<len;i++) {
                // nested join
                if(obj[i].join){
                    if(this.joined.length == 0) {
                        this.joined.push(parent.join(obj[i].name,obj[i].from).on(...obj[i].on).exec());
                    } else {
                        for(var x=0;x<this.joined.length;x++) {
                            rejoin.push(parent.set(this.joined[x]).join(obj[i].name,obj[i].from).on(...obj[i].on).exec());
                        }
                    }
                    this.joined = [...this.joined.concat(rejoin)];
                    this._joinScope('nested',parent,obj[i].join);
                } else {
                    if(this.joined.length >0 ) {
                        parent.set(this.joined[(this.joined.length-1)]).join(obj[i].name,obj[i].from).on(...obj[i].on);
                        this.joined = [];
                    } else {
                        parent.join(obj[i].name,obj[i].from).on(...obj[i].on);
                    }
                    this._selectScope(scope,parent,obj[i]);
                }
            }
        }
    }

    /**
     * Scope for Query Select
     * @param {string} scope 
     * @param {DatabaseBuilder} parent 
     * @param {object} obj 
     */
    _selectScope(scope,parent,obj) {
        scope = scope.toLowerCase();
        this._builderBetween(parent,obj.between);
        this._builderWhere(parent,obj.where);
        this._builderSearch(parent,obj.search);
        this._builderRegExp(parent,obj.regexp);
        this._builderOr(parent,obj.or);
        this._setGroupDetail(parent,obj.groupdetail);
        this._setGroupBy(parent,obj.groupby);
        this._setOrderBy(parent,obj.orderby);
        this._setSkip(parent,obj.skip);
        this._setTake(parent,obj.take);
        this._setPaginate(parent,obj.paginate);
        this._setFields(parent,obj.fields);
    }

    /**
     * Query Builder for Select 
     * @param {object} obj 
     * @return {Promise}
     */
    _select(obj) {
        this.promiseStack.push(new Promise((resolve,reject) => {
            try{
                this._odm.promisify(builder => {return builder}).then(table=>{
                    table.setMode('shallow').set(obj.from);
                    this._selectScope('main',table,obj);
                    // merge
                    this._mergeScope('join',table,obj.merge);
                    // join
                    this._joinScope('join',table,obj.join);
                    var result = table.exec();
                    // join nested
                    if(obj.join && obj.nested) {
                        result = this._builderNested(result,obj.nested);
                    }
                    resolve(result);
                }).catch(error => {
                    reject(error);
                });
            } catch (error) {
                reject(error);
            }
        }));
    }

    /**
     * Set Query
     * @param {array} query 
     * @return {JsonQL}
     */
    query(query) {
        this.clean();
        if(this._odm.isArray(query)) {
            for (var key in query) {
                for (var k in query[key]) {
                    if (query[key].hasOwnProperty(k)) {
                        switch(true) {
                            // case (k == 'insert'):
                            //     // this._insert(query[key].insert);
                            //     break;
                            // case (k == 'update'):
                            //     // this._update(query[key].update);
                            //     break;
                            // case (k == 'modify'):
                            //     // this._modify(query[key].modify);
                            //     break;
                            // case (k == 'delete'):
                            //     // this._delete(query[key].delete);
                            //     break;
                            default:
                                this._select(query[key].select);
                        }
                    }
                }
            }
        }
        return this;
    }

    /**
     * Execute Query Builder
     * @param {callback} callback   Callback(error,data) 
     */
    exec(callback) {
        try{
            const toResultObject = (promise) => {
                return promise
                .then((response) => ({ status: true, response }))
                .catch(error => ({ status: false, error }));
            };
            Promise.all(this.promiseStack.map(toResultObject)).then(result => {
                var len = result.length;
                for (var i = 0; i < len; ++i) {
                    this.content.push(result[i]);
                }
                var dataresult = [...this.content];
                callback(null,dataresult);
            });
        } catch(err) {
            callback(err);
        };
    }

}

module.exports = JsonQL;