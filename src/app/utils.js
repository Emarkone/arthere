export default class Utils {

    static renderAlert(type, text, dismissible) {
        return `<div class="alert alert-${type} ${(dismissible) ? 'alert-dismissible fade show' : ''}" role="alert">
        ${text}
        ${(dismissible) ? '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>' : ''}
        </div>`
    }

    static renderButton(type, text, id = null, style = []) {
        let button = document.createElement('button');

        button.setAttribute("type", "button");
        if (id) button.setAttribute("id", id);
        button.classList.add("btn", `btn-outline-${type}`, ...style);
        button.innerHTML = (text);

        return button;
    }

    static generateID() {
        return 'xxxxxxxx'.replace(/[xy]/g, function (c) {
            let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}