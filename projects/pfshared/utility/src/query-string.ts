export const $queryString = {
    parse(string) {
        const args = {};

        if (typeof string === "undefined") {
            string = window.location.search.substring(1);
        }

        if (string) {
            const fields = string.split("&");
            for (var i = 0; i < fields.length; i++) {
                var pair = fields[i].split("=");
                args[pair[0]] = pair[1];
            }
        }

        return args;
    },
    
    fromArgs(args) {
        let str = "";
        for (let arg in args) {
            if (args.hasOwnProperty(arg)) {
                if (str.length > 0) {
                    str += "&";
                }
                str += (arg + "=" + args[arg]);
            }
        }
        return str;
    }
};


