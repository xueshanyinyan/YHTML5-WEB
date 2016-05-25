'use strict';
angular.module('yhtml5.account', ['ui.bootstrap', 'ngAnimate'])
    .controller('yhtml5.account', function($scope, $http, $uibModal, Upload, $timeout) {
        $http({
            method: "post",
            url: "http://admin.jubaobar.com/front/CashFlow/Record.htm"
        }).success(function(response) {
            console.log(response.data);
            $scope.account = response.data;
        });
        /*上传文件*/
        $scope.uploadPic = function(file) {
            file.upload = Upload.upload({
                url: 'https://yhtml5.com',
                data: {
                    username: $scope.username,
                    file: file
                },
            });
            file.upload.then(function(response) {
                $timeout(function() {
                    file.result = response.data;
                });
            }, function(response) {
                if (response.status > 0)
                    $scope.errorMsg = response.status + ': ' + response.data;
            }, function(evt) {
                // Math.min is to fix IE which reports 200% sometimes
                file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            });
        }
        //get json
        $http.get(__uri("../../server/account.record.json"))
            .success(function(response) {
                $scope.accountRecord = response.accountRecord //$scope.names 为一个数组
            });
        $http.get(__uri("../../server/account.detail.json"))
            .success(function(response) {
                $scope.accountDetail = response.accountDetail //$scope.names 为一个数组
            });
        $scope.animationsEnabled = true;
        $scope.toggleAnimation = function() {
            $scope.animationsEnabled = !$scope.animationsEnabled;
        }
        $scope.accountDetailMoreOpen = function(size) {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'accountDetailMore.html',
                controller: 'accountDetailMoreCtrl',
                size: size
            })
        };
        $scope.accountTopayBatchOpen = function(size) {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'accountTopayBatch.html',
                controller: 'accountTopayBatchCtrl',
                size: size
            })
        };
        $scope.accountTopayConfirmOpen = function(size) {
            /** writed by yangjb 代付信息录入 */
            $http({
                method: "post",
                url: "http://admin.jubaobar.com/front/cashFlow/payForAnotherInformation.htm",
                params: {
                    accountName: $scope.accountName,
                    accountNum: $scope.accountNum,
                    bankId: '2255',
                    bankBranch: $scope.bankBranch,
                    bankProvId: "3355",
                    bankCityId: "4455",
                    accountType: $scope.accountType,
                    remark: $scope.remark,
                    withdrawAmount: $scope.withdrawAmount
                }
            }).success(function(res) {
                $scope.savingBase = false;
                if (res.resultCode == 0) {
                    $scope.app.proxy_base_objectid = res.objectid;
                    $scope.view.state = $scope.view.stateMachine["fullfill_base"];
                    $anchorScroll();
                }
            });
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'accountTopayConfirm.html',
                controller: 'accountTopayConfirmCtrl',
                size: size
            })
        };
        $scope.accountTopayDeleteOpen = function(size) {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'accountTopayDelete.html',
                controller: 'accountTopayDeleteCtrl',
                size: size
            })
        };
        $scope.realNameRemindOpen = function(size) {
            $http({
                method: "post",
                url: "http://admin.jubaobar.com/front/cashFlow/withdrawRecord.htm",
                params: {
                    payAmount: $scope.payAmount
                }
            }).success(function(res) {
                $scope.savingBase = false;
                if (res.resultCode == 0) {
                    $scope.app.proxy_base_objectid = res.objectid;
                    $scope.view.state = $scope.view.stateMachine["fullfill_base"];
                    $anchorScroll();
                }
            });
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'realNameRemind.html',
                controller: 'realNameRemindCtrl',
                size: size
            })
        };

    })
    .controller('accountDetailMoreCtrl', function($scope, $uibModalInstance) {
        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
    })
    .controller('accountTopayBatchCtrl', function($scope, $uibModalInstance) {
        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
    })
    .controller('accountTopayConfirmCtrl', function($scope, $uibModalInstance) {
        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
    })
    .controller('accountTopayDeleteCtrl', function($scope, $uibModalInstance) {
        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
    })
    .controller('realNameRemindCtrl', function($scope, $uibModalInstance) {
        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
    })