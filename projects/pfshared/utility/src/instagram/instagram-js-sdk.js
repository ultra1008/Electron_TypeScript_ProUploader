// Generated by CoffeeScript 1.3.3

(function ($, exports) {
    var instagram;
    instagram = (function () {

        Instagram.prototype.api = 'https://api.instagram.com/v1';

        Instagram.prototype.endPoint = 'https://instagram.com/oauth/authorize/?';

        function Instagram() { }

        Instagram.prototype.auth = function (options) {
            var params;
            params = '';
            $.each(options, function (key, value) {
                return params += key + '=' + value + '&';
            });
            this.authUri = this.endPoint + params;
            return window.location.href = this.authUri;
        };

        Instagram.prototype.getToken = function () {
            return window.location.hash.replace('#access_token=', '');
        };

        Instagram.prototype.setOptions = function (options) {
            var self;
            self = this;
            return $.each(options, function (key, value) {
                return self[key] = value;
            });
        };

        Instagram.prototype.fetch = function (url, callback, params, method) {
            var data,
                jqxhr;

            data = {
                access_token: this.token || '',
                client_id: this.client_id
            };

            jqxhr = $.ajax({
                url: this.api + url,
                type: method || 'GET',
                data: $.extend(data, params || {}),
                dataType: 'jsonp'
            }).done(function (res) {
                if (callback) {
                    return callback(res);
                }
            });

            return jqxhr;
        };

        Instagram.prototype.currentUser = function (callback) {
            return this.fetch('/users/self', callback);
        };

        Instagram.prototype.getFeeds = function (callback, params) {
            return this.fetch('/users/self/feed', callback, params);
        };

        Instagram.prototype.getLikes = function (callback, params) {
            return this.fetch('/users/self/media/liked', callback, params);
        };

        Instagram.prototype.getReqs = function (callback) {
            return this.fetch('/users/self/requested-by', callback);
        };

        Instagram.prototype.getIdByName = function (name, callback) {
            return this.searchUser(name, function (res) {
                var lists, obj;
                lists = res.data;
                name = name.toLowerCase();
                if (lists) {
                    obj = lists[0];
                }
                if (obj && obj['username'] === name) {
                    return callback(obj['id']);
                } else {
                    return callback(false);
                }
            });
        };

        Instagram.prototype.getUser = function (id, callback) {
            return this.fetch('/users/' + id, callback);
        };

        Instagram.prototype.getPhotos = function (id, callback, params) {
            return this.fetch('/users/' + id + '/media/recent', callback, params);
        };

        Instagram.prototype.getFollowing = function (id, callback) {
            return this.fetch('/users/' + id + '/follows', callback, params);
        };

        Instagram.prototype.getFans = function (id, callback) {
            return this.fetch('/users/' + id + '/followed-by', callback, params);
        };

        Instagram.prototype.getRelationship = function (id, callback) {
            return this.fetch('/users/' + id + '/relationship', callback);
        };

        Instagram.prototype.isPrivate = function (id, callback) {
            return this.getUser(id, function (res) {
                return callback(res.meta.error_message === 'you cannot view this resource');
            });
        };

        Instagram.prototype.isFollowing = function (id, callback) {
            return this.getRelationship(id, function (res) {
                return callback(res.data.outgoing_status === 'follows');
            });
        };

        Instagram.prototype.isFollowedBy = function (id, callback) {
            return this.getRelationship(id, function (res) {
                return callback(res.data.incoming_status !== 'none');
            });
        };

        Instagram.prototype.editRelationship = function (id, callback, action) {
            return this.fetch('/users/' + id + '/relationship', callback, {
                action: action
            }, 'POST');
        };

        Instagram.prototype.follow = function (id, callback) {
            return this.editRelationship(id, callback, 'follow');
        };

        Instagram.prototype.unfollow = function (id, callback) {
            return this.editRelationship(id, callback, 'unfollow');
        };

        Instagram.prototype.block = function (id, callback) {
            return this.editRelationship(id, callback, 'block');
        };

        Instagram.prototype.unblock = function (id, callback) {
            return this.editRelationship(id, callback, 'unblock');
        };

        Instagram.prototype.approve = function (id, callback) {
            return this.editRelationship(id, callback, 'approve');
        };

        Instagram.prototype.deny = function (id, callback) {
            return this.editRelationship(id, callback, 'deny');
        };

        Instagram.prototype.searchUser = function (q, callback) {
            return this.fetch('/users/search?q=' + q, callback);
        };

        Instagram.prototype.getPhoto = function (id, callback, params) {
            return this.fetch('/media/' + id, callback, params);
        };

        Instagram.prototype.searchPhoto = function (callback, params) {
            return this.fetch('/media/search', callback, params);
        };

        Instagram.prototype.getPopular = function (callback, params) {
            return this.fetch('/media/popular', callback, params);
        };

        Instagram.prototype.getComments = function (id, callback, params) {
            return this.fetch('/media/' + id + '/comments', callback, params);
        };

        Instagram.prototype.postComment = function (id, callback, params) {
            return this.fetch('/media/' + id + '/comments', callback, params, 'POST');
        };

        Instagram.prototype.deleteComment = function (id, callback) {
            return this.fetch('/media/' + id + '/comments', callback, {}, 'DELETE');
        };

        Instagram.prototype.getLikes = function (id, callback, params) {
            return this.fetch('/media/' + id + '/likes', callback, params);
        };

        Instagram.prototype.addLike = function (id, callback) {
            return this.fetch('/media/' + id + '/likes', callback, {}, 'POST');
        };

        Instagram.prototype.deleteLike = function (id, callback) {
            return this.fetch('/media/' + id + '/likes', callback, {}, 'DELETE');
        };

        Instagram.prototype.getTag = function (tagName, callback, params) {
            return this.fetch('/tags/' + tagName, callback, params);
        };

        Instagram.prototype.getRecentTags = function (tagName, callback, params) {
            return this.fetch('/tags/' + tagName + '/media/recent', callback, params);
        };

        Instagram.prototype.searchTag = function (callback, params) {
            return this.fetch('/tags/search', callback, params);
        };

        Instagram.prototype.getLocation = function (locId, callback, params) {
            return this.fetch('/locations/' + locId, callback, params);
        };

        Instagram.prototype.getRecentLocations = function (locId, callback, params) {
            return this.fetch('/locations/' + locId + '/media/recent', callback, params);
        };

        Instagram.prototype.searchLocation = function (callback, params) {
            return this.fetch('/locations/search', callback, params);
        };

        Instagram.prototype.getNearby = function (id, callback, params) {
            return this.fetch('/geographies/' + id + '/media/recent', callback, params);
        };

        return Instagram;

    })();
    return exports.Instagram = instagram;
})(jQuery, window);
