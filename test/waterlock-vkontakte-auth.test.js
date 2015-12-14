var should = require('should');
var proxyquire =  require('proxyquire');

var pathStub = {
    normalize: function(){
        return __dirname+"/waterlock.config.js";
    }
};

var wl = proxyquire.noCallThru().load('../lib/waterlock-vkontakte-auth', { 'path': pathStub});

describe('waterlock-vkontakte-auth', function(){
    
    it('should export actions', function(done){
        wl.should.have.property('actions');

        done();
    });
    
    it('should export a model', function(done){
        wl.should.have.property('model');
        done();
    });

    it('should export a vk instance', function(done){
        wl.should.have.property('vk');
        done();
    });
})