const { MEU_CARRINHO } = require("./app");

cardapio.metodos = {
    //obtem a lista de itens do cardápio
    obterItensCardapio: (categoria = 'burgers', vermais = false) => {
        var filtro = MENU[categoria];
        console.log(filtro);
        if (!vermais) {
            $("#itensCardapio").html('');
            $("#btnVerMais").removeClass('hidden');
        }
        //$("#itensCardapio").html('')
        $.each(filtro, (i, e) => {
            console.log(e.name);
            // let temp = cardapio.templates.item;
            let temp = cardapio.templates.item.replace(/\${img}/g, e.img)
                .replace(/\${name}/g, e.name)
                .replace(/\${id}/g, e.id)
                .replace(/\${price}/g, e.price.toFixed(2).replace('.', ','));

            //botão ver mais foi clicado (12 itens)
            if (vermais && i >= 8 && i < 12) {
                $("#itensCardapio").append(temp);
            }
            //paginação inicial (8 itens)
            if (!vermais && i < 8) {
                $("#itensCardapio").append(temp);
            }
            // $("#itensCardapio").append(temp)
        });

        //remove o ativo
        $(".container-menu a").removeClass('active');

        //seta o menu para ativo
        $("#menu-" + categoria).addClass('active');

    },

    //clique no botão ver mais
    verMais: () => {
        var ativo = $(".container-menu a.active").attr('id').split('menu-')[1]; // [menu-][burgers]
        cardapio.metodos.obterItensCardapio(ativo, true);

        $("#btnVerMais").addClass('hidden');
    },

    //diminui a quantidade do item do cardápio
    diminuirQuantidade: (id) => {
        let qntdAtual = parseInt($('#qntd-' + id).text());
        if (qntdAtual > 0) {
            $('#qntd-' + id).text(qntdAtual - 1);
        }
    },
    //aumenta a quantidade do item do cardápio
    aumentarQuantidade: (id) => {
        let qntdAtual = parseInt($('#qntd-' + id).text());
        $('#qntd-' + id).text(qntdAtual + 1);

    },

    // adicionar ao carrinho o item do cardápio
    adicionarAoCarrinho: (id) => {

        let qntdAtual = parseInt($("#qntd-" + id).text());

        if (qntdAtual > 0) {

            // obter a categoria ativa
            var categoria = $(".container-menu a.active").attr('id').split('menu-')[1];

            // obtem a lista de itens
            let filtro = MENU[categoria];

            // obtem o item
            let item = $.grep(filtro, (e, i) => { return e.id == id; });

            if (item.length > 0) {

                // validar se já existe esse item no carrinho
                let existe = $.grep(MEU_CARRINHO, (elem, index) => { return elem.id == id; });

                // caso já exista o item no carrinho, só altera a quantidade
                if (existe.length > 0) {
                    let objIndex = MEU_CARRINHO.findIndex((obj => obj.id == id));
                    MEU_CARRINHO[objIndex].qntd = MEU_CARRINHO[objIndex].qntd + qntdAtual;
                }

                // caso ainda não exista o item no carrinho, adiciona ele 
                else {
                    item[0].qntd = qntdAtual;
                    MEU_CARRINHO.push(item[0]);
                }

                cardapio.metodos.mensagem("Item adicionado ao carrinho!", 'green');
                $("#qntd-" + id).text(0);

                cardapio.metodos.atualizarBadgeTotal();

            }

        }

    },

    // atualiza o badge de totais dos botões "Meu carrinho"
    atualizarBadgeTotal: () => {

        var total = 0;

        $.each(MEU_CARRINHO, (i, e) => {
            total += e.qntd;
        });

        if (total > 0) {
            $(".botao-carrinho").removeClass('hidden');
            $(".container-total-carrinho").removeClass('hidden');
        }
        else {
            $(".botao-carrinho").addClass('hidden');
            $(".container-total-carrinho").addClass('hidden');
        }

        $(".badge-total-carrinho").html(total);

    },

    // abrir a modal de carrinho
    abrirCarrinho: (abrir) => {


        if (abrir) {
            $("#modalCarrinho").removeClass('hidden');
            cardapio.metodos.carregarCarrinho();
        }
        else {
            $("#modalCarrinho").addClass('hidden');
        }

    },

    // altera os texto e exibe os botões das etapas
    carregarEtapa: (etapa) => {

        if (etapa == 1) {
            $("#lblTituloEtapa").text('Seu carrinho:');
            $("#itensCarrinho").removeClass('hidden');
            $("#localEntrega").addClass('hidden');
            $("#resumoCarrinho").addClass('hidden');

            $(".etapa").removeClass('active');
            $(".etapa1").addClass('active');

            $("#btnEtapaPedido").removeClass('hidden');
            $("#btnEtapaEndereco").addClass('hidden');
            $("#btnEtapaResumo").addClass('hidden');
            $("#btnVoltar").addClass('hidden');
        }

        if (etapa == 2) {
            $("#lblTituloEtapa").text('Endereço de entrega:');
            $("#itensCarrinho").addClass('hidden');
            $("#localEntrega").removeClass('hidden');
            $("#resumoCarrinho").addClass('hidden');

            $(".etapa").removeClass('active');
            $(".etapa1").addClass('active');
            $(".etapa2").addClass('active');

            $("#btnEtapaPedido").addClass('hidden');
            $("#btnEtapaEndereco").removeClass('hidden');
            $("#btnEtapaResumo").addClass('hidden');
            $("#btnVoltar").removeClass('hidden');
        }

        if (etapa == 3) {
            $("#lblTituloEtapa").text('Resumo do pedido:');
            $("#itensCarrinho").addClass('hidden');
            $("#localEntrega").addClass('hidden');
            $("#resumoCarrinho").removeClass('hidden');

            $(".etapa").removeClass('active');
            $(".etapa1").addClass('active');
            $(".etapa2").addClass('active');
            $(".etapa3").addClass('active');

            $("#btnEtapaPedido").addClass('hidden');
            $("#btnEtapaEndereco").addClass('hidden');
            $("#btnEtapaResumo").removeClass('hidden');
            $("#btnVoltar").removeClass('hidden');
        }

    },

    // botão de voltar etapa
    voltarEtapa: () => {

        let etapa = $(".etapa.active").length;
        cardapio.metodos.carregarEtapa(etapa - 1);

    },

    // carrega a lista de itens do carrinho
    carregarCarrinho: () => {


        cardapio.metodos.carregarEtapa(1);

        if (MEU_CARRINHO.length > 0) {

            $("#itensCarrinho").html('');

            $.each(MEU_CARRINHO, (i, e) => {

                let temp = cardapio.templates.itemCarrinho.replace(/\${img}/g, e.img)
                    .replace(/\${nome}/g, e.name)
                    .replace(/\${preco}/g, e.price.toFixed(2).replace('.', ','))
                    .replace(/\${id}/g, e.id)
                    .replace(/\${qntd}/g, e.qntd);

                $("#itensCarrinho").append(temp);

            });

        }
        else {
            $("#itensCarrinho").html('');
            $.each(MEU_CARRINHO, (i, e) => {
                let temp = cardapio.templates.itemCarrinho.replace(/\\${img}/g, e.img)
                    .replace(/\\${nome}/g, e.name)
                    .replace(/\\${preco}/g, e.price.toFixed(2).replace('.', ','))
                    .replace(/\\${id}/g, e.id)
                    .replace(/\\${qntd}/g, e.qntd);
                $("#itensCarrinho").append(temp);
            });
        }
    },
    else: {
        $() { }, : .html('<p class="Carrinho-Vazio"><i class="fa fa-shooping-bag"></i>Seu Carrinho está vazio.</p>')
    }
},

    diminuirQuantidadeCarrinho;
