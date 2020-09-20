//все для модального окна, попробуем сделать под ООП вид
//но видимо не самая практичная затея, но попробовать можно)
//modal = div#modal

let Modal = {
    height: 200,
    width: 500,
    message: 'Message',
    headColor: 'orange',

    sayHello: function () {
      console.log('hello');
    },

    showModal: function () {
        console.log(this);
        modal_message.textContent = this.message;
        modal_body.style.height = this.height + 'px';
        modal_body.style.width = this.width + 'px';
        modal.style.display = 'flex';
    },

    showEnemyInfo: function (message) {
        this.message = message;
        this.height = 100;
        this.width = 300;
        this.showModal();
    },

    closeModal: function () {
        modal.style.display = 'none';
    }
}

let modalObject = Object.create(Modal);
modal_close.onclick = function(){
    modalObject.closeModal();
};

