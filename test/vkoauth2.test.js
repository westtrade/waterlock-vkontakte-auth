var should = require('should');
var proxyquire = require('proxyquire');

var VKOAuth2 = proxyquire('../lib/vkoauth2',{
  request: function(a, cb){
    cb(true);
  }
});

describe('VKOAuth2', function(){
  it('should create an vkoauth instance', function(done){
    var vk = new VKOAuth2('foo','bar','faz');
    vk.should.be.instanceOf(VKOAuth2);
    done();
  });

  describe('getLoginDialogURI', function(){
    it('should return login uri', function(done){
      var vk = new VKOAuth2('foo','bar','faz');
      var uri = vk.getLoginDialogURI();
      uri.should.be.ok;
      done();
    });
  });

});