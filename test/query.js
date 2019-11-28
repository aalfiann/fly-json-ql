const assert = require('assert');
const JsonQL = require('../src/flyjsonql');

describe('query test', function() {

    var data1 = [
        {user_id:1,name:'budi',age:10},
        {user_id:5,name:'wawan',age:20},
        {user_id:3,name:'tono',age:30}
    ];
    
    var data2 = [
        {id:1,address:'bandung',email:'a@b.com'},
        {id:2,address:'jakarta',email:'c@d.com'},
        {id:3,address:'solo',email:'e@f.com'},
        {id:4,address:'solo, balapan',email:'g@h.com'},
        {id:5,address:'surabaya',email:'i@j.com'}
    ];
    
    var data3 = [
        {id:1,bio:'I was born in bandung',phone:'a@b.com'},
        {id:2,bio:'I was born in jakarta',phone:'c@d.com'},
        {id:3,bio:'I was born in solo',phone:'e@f.com'},
        {id:4,bio:'I was born in semarang',phone:'g@h.com'},
        {id:5,bio:'I was born in surabaya',phone:'i@j.com'}
    ];

    var data4 = [
        {id:1,about:'I come from bandung'},
        {id:2,about:'I come from jakarta'},
        {id:3,about:'I come from solo'},
        {id:4,about:'I come from semarang'},
        {id:5,about:'I come from surabaya'}
    ];
    
    var data5 = [
        {brand:'Audi',color:'black',stock:32},
        {brand:'Audi',color:'white',stock:76},
        {brand:'Ferarri',color:'red',stock:8},
        {brand:'Ford',color:'white',stock:49},
        {brand:'Peugot',color:'white',stock:23}
    ];

    it('get odm', function() {
        const jsonql = new JsonQL();
        var result = jsonql.odm;
        // console.log(result);
    });

    it('query must an array object', function() {
        const jsonql = new JsonQL();
        var result = jsonql.query('abc');
        // console.log(result);
    });

    it('query must hasOwnProperty', function() {
        const jsonql = new JsonQL();
        const q = [
            Object.create({select: 'inherited'})
        ];
        var result = jsonql.query(q);
        // console.log(result);
    });

    it('select + where', function() {
        const jsonql = new JsonQL();

        var q = [
            {
                select:{
                    from:data1,
                    where: [
                        ['name','==','wawan']
                    ]
                }
            }
        ];

        jsonql.query(q).exec(function(err, data) {
            // console.log(JSON.stringify(data));
        })
    });
    
    it('select + where + and', function() {
        const jsonql = new JsonQL();

        var q = [
            {
                select:{
                    from:data2,
                    where: [
                        ['address','like','a'],
                        ['address','like','ba']
                    ]
                }
            }
        ];

        jsonql.query(q).exec(function(err, data) {
            // console.log(JSON.stringify(data));
        })
    });

    it('select + between', function() {
        const jsonql = new JsonQL();

        var q = [
            {
                select:{
                    from:data1,
                    between: [
                        ['age','20','30']
                    ]
                }
            }
        ];

        jsonql.query(q).exec(function(err, data) {
            // console.log(JSON.stringify(data));
        })
    });

    it('select + search', function() {
        const jsonql = new JsonQL();

        var q = [
            {
                select:{
                    from:data2,
                    search: [
                        ['address','solo']
                    ]
                }
            }
        ];

        jsonql.query(q).exec(function(err, data) {
            // console.log(JSON.stringify(data));
        })
    });

    it('select + regexp', function() {
        const jsonql = new JsonQL();

        var q = [
            {
                select:{
                    from:data2,
                    regexp: [
                        ['address',/balapan/]
                    ]
                }
            }
        ];

        jsonql.query(q).exec(function(err, data) {
            // console.log(JSON.stringify(data));
        })
    });

    it('select + join', function() {
        const jsonql = new JsonQL();

        var q = [
            {
                select:{
                    from:data1,
                    join: [
                        {
                            name:'data2',
                            from: data2,
                            on: ['user_id','id']
                        }
                    ]
                }
            }
        ];

        jsonql.query(q).exec(function(err, data) {
            // console.log(JSON.stringify(data));
        })
    });

    it('select + join nested', function() {
        const jsonql = new JsonQL();

        var q = [
            {
                select:{
                    from:data1,
                    join: [
                        {
                            name:'data2',
                            from: data2,
                            on: ['user_id','id'],
                            join: [
                                {
                                    name:'data3',
                                    from: data3,
                                    on: ['user_id','id'],
                                    join:[
                                        {
                                            name:'data4',
                                            from: data4,
                                            on: ['user_id','id']
                                        }
                                    ]
                                }
                            ]
                        }
                    ],
                    nested:['data2','data3','data4']
                }
            }
        ];

        jsonql.query(q).exec(function(err, data) {
            // console.log(JSON.stringify(data));
        })
    });

    it('select + where + or', function() {
        const jsonql = new JsonQL();

        var q = [
            {
                select:{
                    from:data1,
                    or:[
                        {
                            where:[
                                ['name','==','wawan']
                            ]
                        },
                        {
                            where:[
                                ['name','==','budi']
                            ]
                        }
                    ]
                }
            }
        ];

        jsonql.query(q).exec(function(err, data) {
            // console.log(JSON.stringify(data));
        })
    });

    it('select + where + or', function() {
        const jsonql = new JsonQL();

        var q = [
            {
                select:{
                    fields:['name','age'],
                    from:data1,
                    or:[
                        {
                            where:[
                                ['name','==','wawan']
                            ]
                        },
                        {
                            where:[
                                ['name','==','budi']
                            ]
                        }
                    ]
                }
            }
        ];

        jsonql.query(q).exec(function(err, data) {
            // console.log(JSON.stringify(data));
        })
    });

    it('select + where + or + orderby', function() {
        const jsonql = new JsonQL();

        var q = [
            {
                select:{
                    fields:['name','age'],
                    from:data1,
                    or:[
                        {
                            where:[
                                ['name','==','wawan']
                            ]
                        },
                        {
                            where:[
                                ['name','==','budi']
                            ]
                        }
                    ],
                    orderby:['name',false]
                }
            }
        ];

        jsonql.query(q).exec(function(err, data) {
            // console.log(JSON.stringify(data));
        });
    });

    it('select + where + or + orderby + skip', function() {
        const jsonql = new JsonQL();

        var q = [
            {
                select:{
                    fields:['name','age'],
                    from:data1,
                    or:[
                        {
                            where:[
                                ['name','==','wawan']
                            ]
                        },
                        {
                            where:[
                                ['name','==','budi']
                            ]
                        }
                    ],
                    orderby:['name',false],
                    skip:1
                }
            }
        ];

        jsonql.query(q).exec(function(err, data) {
            // console.log(JSON.stringify(data));
        });
    });

    it('select + where + orderby + skip + take', function() {
        const jsonql = new JsonQL();

        var q = [
            {
                select:{
                    fields:['name','age'],
                    from:data1,
                    orderby:['name',false],
                    skip:1,
                    take:2
                }
            }
        ];

        jsonql.query(q).exec(function(err, data) {
            // console.log(JSON.stringify(data));
        });
    });

    it('select + orderby + paginate', function() {
        const jsonql = new JsonQL();

        var q = [
            {
                select:{
                    fields:['name','age'],
                    from:data1,
                    orderby:['name',false],
                    paginate:[1,2]
                }
            }
        ];

        jsonql.query(q).exec(function(err, data) {
            // console.log(JSON.stringify(data));
        });
    });

    it('select + groupby + orderby', function() {
        const jsonql = new JsonQL();

        var q = [
            {
                select:{
                    from:data5,
                    groupby:['brand'],
                    orderby:['brand',false]
                }
            }
        ];

        jsonql.query(q).exec(function(err, data) {
            // console.log(JSON.stringify(data));
        });
    });

    it('select + groupby + sum[stock] + orderby', function() {
        const jsonql = new JsonQL();

        var q = [
            {
                select:{
                    from:data5,
                    groupby:['brand',['stock']],
                    orderby:['brand',false]
                }
            }
        ];

        jsonql.query(q).exec(function(err, data) {
            // console.log(JSON.stringify(data));
        });
    });

    it('select + groupdetail', function() {
        const jsonql = new JsonQL();

        var q = [
            {
                select:{
                    from:data5,
                    groupdetail:['brand']
                }
            }
        ];

        jsonql.query(q).exec(function(err, data) {
            // console.log(JSON.stringify(data));
        });
    });

    it('select + merge', function() {
        const jsonql = new JsonQL();

        var q = [
            {
                select:{
                    from:data1,
                    merge: [
                        {
                            name:'data2',
                            from: data2,
                            on: ['user_id','id']
                        }
                    ]
                }
            }
        ];

        jsonql.query(q).exec(function(err, data) {
            // console.log(JSON.stringify(data));
        })
    });

    it('select + merge nested', function() {
        const jsonql = new JsonQL();

        var q = [
            {
                select:{
                    from:data1,
                    merge: [
                        {
                            name:'data2',
                            from: data2,
                            on: ['user_id','id'],
                            merge: [
                                {
                                    name:'data3',
                                    from: data3,
                                    on: ['user_id','id'],
                                    merge:[
                                        {
                                            name:'data4',
                                            from: data4,
                                            on: ['user_id','id']
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            }
        ];

        jsonql.query(q).exec(function(err, data) {
            // console.log(JSON.stringify(data));
        })
    });

});