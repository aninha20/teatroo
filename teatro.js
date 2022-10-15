//obter os elementos da pagina
const frm = document.querySelector("form")
const dvPalco = document.querySelector("#divPalco")

//constante para definir o numero de poltronas
const P = 240;

// vetor com as poltronas reservadas pelo cliente
const reservadas = [];

window.addEventListener("load", () =>{
    //operador ternário
    //se houver dados salvos em localStorage, faz um split(";") e
    //atribui esses dados ao array, caso contrário, inicializamos o array
    const ocupadas = localStorage.getItem("teatroOcupadas") ? localStorage.getItem("teatroOcupadas").split(";") : [];

    //montar o numero total de poltronas dfefinidas pela constante

    for (let i = 1; i<= P; i++){
        const figure= document.createElement("figure"); //cria a tag figura
        const imgStatus= document.createElement("img"); //cria a tag img

        //se a posição estiver ocupada exibir a imagem ocupada, senão a imagem disponovel

        imgStatus.src = ocupadas.includes(i.toString()) ? "img/ocupada.jpg" : "img/disponivel.jpg";

        imgStatus.className = "poltrona"; //classe com dimensão da imagem 

        const figureCap = document.createElement("figcaption") //cria figcaption

        //quantidade de zeros antes do número da poltrona
        const zeros = i < 10 ? "00" : i <100 ? "0" : "";

        const num = document.createTextNode(`[${zeros}${i}]`); //cria o texto

        //define os pais de cada tag criada
        figureCap.appendChild(num)
        figure.appendChild(imgStatus)
        figure.appendChild(figureCap)

        //se i modulo de 24 == 12 (é o corredor: define margem direita 60px)

        if(i % 24==12) figure.style.marginRight = "60px"

        dvPalco.appendChild(figure); //indica que a figura é filha de divPalco

        //se i modulo 24 ==0 o codigo apos o && será executado(inserindo quebra de linha)
        (i % 24 == 0) && dvPalco.appendChild(document.createElement ("br"));
    }
})

frm.addEventListener("submit", (e) => {
    e.preventDefault();

    //obtem o conteudo do input

    const poltrona = Number(frm.inPoltrona.value);

    //valida o preeenchimento

    if(poltrona > P) {
        alert("informe o número de poltrona válida!")
        frm.inPoltrona.focus();
        return;
    }

    const ocupadas = localStorage.getItem("teatroOcupadas")
    ? localStorage.getItem("teatroOcupadas").split(";")
    :[];
     console.log(reservadas)

    if(ocupadas.includes(poltrona)){
        alert(`Poltrona ${poltrona} já está ocupada`);
        frm.inPoltrona.value ="";
        frm.inPoltrona.focus();
        return;
    }
    //validar se a poltrona já estiver ocupada
    if(reservadas.includes(poltrona)){
        alert(`Poltrona ${poltrona} já está reservada`);
        frm.inPoltrona.value ="";
        frm.inPoltrona.focus();
        return;
    }
    //capturar a imagem da poltrona filha de divPalco
    const imgPoltrona = dvPalco.querySelectorAll("img")[poltrona - 1]

    imgPoltrona.src = "img/reservada.jpg"; //modificfa o atributo da img

    reservadas.push(poltrona); //adiciona a poltrona ao vetor

    frm.inPoltrona.value = "";
    frm.inPoltrona.focus();
})

frm.btConfirmar.addEventListener("click", (e)=>{
    //verificar se não há poltronas reservadas
    if(reservadas.length == 0){
        alert("Não há poltronas reservadas!!");
        frm.inPoltrona.value = "";
        frm.inPoltrona.focus();
        return;
    }

    const ocupadas = localStorage.getItem("teatroOcupadas") ? localStorage.getItem("teatroOcupadas").split(";"): [];

 //for descrecente, pois as reservas vão sendo removidas a cada alteração da imagem
    for(let i=reservadas.length-1; i>=0; i--){
        ocupadas.push(reservadas[i]);

        //captura a imagem da poltrona, filha e divPalco. É pois começa em 0

        const imgPoltrona = dvPalco.querySelectorAll("img")[reservadas[i]-1];
        imgPoltrona.src = "img/ocupada.jpg";//modifica a imagem

        reservadas.pop(); //remove do vetor a reserva já alterada
    }

    localStorage.setItem("teatroOcupadas", ocupadas.join(";"));
});

frm.btRetirar.addEventListener("click", (e) => {
    //obtem o conteúdo do input
    const poltrona = Number(frm.inPoltrona.value);
    if(poltrona > P || poltrona<=0){
        alert("Informe um número de poltrona válido!");
        return;
    }

    //se houver dados salvos em localStorage, faz um split(";") e
    //atribui esses dados ao array, caso contrário, inicializamos o array
    const ocupadas = localStorage.getItem("teatroOcupadas")
    ? localStorage.getItem("teatroOcupadas").split(";"): [];

    //verifica se a poltrona está ocupada
    if(!ocupadas.includes(poltrona+"")){
        alert(`A poltrona ${poltrona} não está ocupada`);
        frm.inPoltrona.value = "";
        frm.inPoltrona.focus();
        return;
    }
    //confirmação
    if(!confirm("Deseja cancelar a reserva?"))return;

    ocupadas.splice(ocupadas.indexOf(poltrona.toString()));

    const imgPoltrona = dvPalco.querySelectorAll("img")[poltrona-1];
    imgPoltrona.src = "img/disponivel.jpg";//modifica o atributo da img

    frm.inPoltrona.value = "";
    frm.inPoltrona.focus();

    localStorage.setItem("teatroOcupadas", ocupadas.join(";"));

    return;
});
