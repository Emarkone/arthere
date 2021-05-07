export default class User {

    constructor({username, password}) {
        this.username = username;
        this.password = password;
    }

    checkPassword(password) {
        return (this.password === password);
    }
}