var app = angular.module('metaCoinApp', []);

app.config(function($locationProvider) {
    $locationProvider.html5Mode(true);
});

app.controller("metaCoinController", ['$scope', '$location', '$http', '$q', '$window', '$timeout', function($scope, $location, $http, $q, $window, $timeout) {
    // Everything
    $scope.sendCoin = function(amount, receiver) {
        var meta = MetaCoin.deployed();

        setStatus("Initiating transaction... (please wait)");

        meta.sendCoin(receiver, amount, {
            from: $scope.account
        }).then(function() {
            setStatus("Transaction complete!");
            $scope.refreshBalance();
        }).catch(function(e) {
            console.log(e);
            setStatus("Error sending coin; see log.");
        });
    };

    $scope.refreshBalance = function() {
	    var meta = MetaCoin.deployed();

	    meta.getBalance.call($scope.account, {from: $scope.account})
		    .then(function(value) {
			    $timeout(function () {
				    $scope.balance = value.valueOf();
			    });
		    }).catch(function(e) {
			    console.log(e);
			    setStatus("Error getting balance; see log.");
		    });
    };

    $window.onload = function () {
	    web3.eth.getAccounts(function(err, accs) {
		// Same as before
		$scope.accounts = accs;
		$scope.account = $scope.accounts[0];
		$scope.refreshBalance();
	    });
    }

}]);
