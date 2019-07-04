!
function(t){
    var cityList = [{
        key: 'A',
        data: ['AL|阿尔巴尼亚', 'DZ|阿尔及利亚', 'AR|阿根廷', 'AF|阿富汗', 'IE|爱尔兰', 'EG|埃及', 'ET|埃塞俄比亚', 'EE|爱沙尼亚', 'AE|阿联酋', 'AW|阿鲁巴', 'OM|阿曼', 'AD|安道尔', 'AI|安圭拉', 'AO|安哥拉', 'AG|安提瓜和巴布达', 'AU|澳大利亚', 'AT|奥地利', 'AX|奥兰群岛', 'AZ|阿塞拜疆']
    },
    {
        key: 'B',
        data: ['BB|巴巴多斯', 'PG|巴布亚新几内亚', 'BS|巴哈马', 'BY|白俄罗斯', 'BM|百慕大', 'PK|巴基斯坦', 'PY|巴拉圭', 'PS|巴勒斯坦', 'BH|巴林', 'PA|巴拿马', 'BG|保加利亚', 'BR|巴西', 'MP|北马里亚纳群岛', 'BJ|贝宁', 'BE|比利时', 'PE|秘鲁', 'IS|冰岛', 'PR|波多黎各', 'BA|波黑', 'PL|波兰', 'BO|玻利维亚', 'BW|博茨瓦纳', 'BZ|伯利兹', 'BT|不丹', 'BF|布基纳法索', 'BI|布隆迪', 'BV|布韦岛']
    },
    {
        key: 'C',
        data: ['GQ|赤道几内亚']
    },
    {
        key: 'D',
        data: ['DK|丹麦', 'DE|德国', 'TL|东帝汶', 'TG|多哥', 'DO|多米尼加', 'DM|多米尼克']
    },
    {
        key: 'E',
        data: ['EC|厄瓜多尔', 'ER|厄立特里亚', 'RU|俄罗斯']
    },
    {
        key: 'F',
        data: ['FR|法国', 'FO|法罗群岛', 'VA|梵蒂冈', 'PF|法属波利尼西亚', 'GF|法属圭亚那', 'TF|法属南部领地', 'MF|法属圣马丁', 'FJ|斐济群岛', 'PH|菲律宾', 'FI|芬兰', 'CV|佛得角']
    },
    {
        key: 'G',
        data: ['GM|冈比亚', 'CG|刚果（布）', 'CD|刚果（金）', 'GL|格陵兰', 'GD|格林纳达', 'GE|格鲁吉亚', 'CO|哥伦比亚', 'GG|根西岛', 'CR|哥斯达黎加', 'GP|瓜德罗普', 'GU|关岛', 'CU|古巴', 'GY|圭亚那']
    },
    {
        key: 'H',
        data: ['HT|海地', 'KR|韩国 南朝鲜', 'KZ|哈萨克斯坦', 'HM|赫德岛和麦克唐纳群岛', 'ME|黑山', 'NL|荷兰', 'BQ|荷兰加勒比区', 'HN|洪都拉斯']
    },
    {
        key: 'J',
        data: ['GH|加纳', 'CA|加拿大', 'KH|柬埔寨', 'GA|加蓬', 'DJ|吉布提', 'CZ|捷克', 'KG|吉尔吉斯斯坦', 'KI|基里巴斯', 'ZW|津巴布韦', 'GN|几内亚', 'GW|几内亚比绍']
    },
    {
        key: 'K',
        data: ['KY|开曼群岛', 'CM|喀麦隆', 'CC|科科斯群岛', 'HR|克罗地亚', 'KM|科摩罗', 'KE|肯尼亚', 'CI|科特迪瓦', 'KW|科威特', 'CK|库克群岛']
    },
    {
        key: 'L',
        data: ['LS|莱索托', 'LA|老挝', 'LV|拉脱维亚', 'LB|黎巴嫩', 'LR|利比里亚', 'LY|利比亚', 'LI|列支敦士登', 'LT|立陶宛', 'RE|留尼汪', 'RO|罗马尼亚', 'LU|卢森堡', 'RW|卢旺达']
    },
    {
        key: 'M',
        data: ['MG|马达加斯加', 'IM|马恩岛', 'MV|马尔代夫', 'MT|马耳他', 'FK|马尔维纳斯群岛（ 福克兰）', 'MY|马来西亚', 'MW|马拉维', 'ML|马里', 'MU|毛里求斯', 'MR|毛里塔尼亚', 'MK|马其顿', 'MH|马绍尔群岛', 'MQ|马提尼克', 'YT|马约特', 'US|美国', 'UM|美国本土外小岛屿', 'AS|美属萨摩亚', 'VI|美属维尔京群岛', 'MN|蒙古国 蒙古', 'BD|孟加拉', 'MS|蒙塞拉特岛', 'MM|缅甸', 'FM|密克罗尼西亚联邦', 'MD|摩尔多瓦', 'MA|摩洛哥', 'MC|摩纳哥', 'MZ|莫桑比克', 'MX|墨西哥']
    },
    {
        key: 'N',
        data: ['NA|纳米比亚', 'ZA|南非', 'AQ|南极洲', 'GS|南乔治亚岛和南桑威奇群岛', 'SS|南苏丹', 'NR|瑙鲁', 'NP|尼泊尔', 'NI|尼加拉瓜', 'NE|尼日尔', 'NG|尼日利亚', 'NU|纽埃', 'NF|诺福克岛', 'NO|挪威']
    },
    {
        key: 'P',
        data: ['PW|帕劳', 'PN|皮特凯恩群岛', 'PT|葡萄牙']
    },
    {
        key: 'Q',
        data: ['QA|卡塔尔']
    },
    {
        key: 'R',
        data: ['JP|日本', 'SE|瑞典', 'CH|瑞士']
    },
    {
        key: 'S',
        data: ['SV|萨尔瓦多', 'RS|塞尔维亚', 'SL|塞拉利昂', 'SN|塞内加尔', 'CY|塞浦路斯', 'SC|塞舌尔', 'WS|萨摩亚', 'SA|沙特阿拉伯', 'BL|圣巴泰勒米岛', 'CX|圣诞岛', 'ST|圣多美和普林西比', 'SH|圣赫勒拿', 'KN|圣基茨和尼维斯', 'LC|圣卢西亚', 'SM|圣马力诺', 'PM|圣皮埃尔和密克隆', 'VC|圣文森特和格林纳丁斯', 'LK|斯里兰卡', 'SK|斯洛伐克', 'SI|斯洛文尼亚', 'SJ|斯瓦尔巴群岛和 扬马延岛', 'SZ|斯威士兰', 'SD|苏丹', 'SR|苏里南', 'SB|所罗门群岛', 'SO|索马里']
    },
    {
        key: 'T',
        data: ['TH|泰国', 'TJ|塔吉克斯坦', 'TO|汤加', 'TZ|坦桑尼亚', 'TC|特克斯和凯科斯群岛', 'TT|特立尼达和多巴哥', 'TM|土库曼斯坦', 'TN|突尼斯', 'TK|托克劳', 'TR|土耳其', 'TV|图瓦卢']
    },
    {
        key: 'W',
        data: ['WF|瓦利斯和富图纳', 'VU|瓦努阿图', 'GT|危地马拉', 'VE|委内瑞拉', 'BN|文莱', 'UG|乌干达', 'UA|乌克兰', 'UY|乌拉圭', 'UZ|乌兹别克斯坦']
    },
    {
        key: 'X',
        data: ['ES|西班牙', 'GR|希腊', 'SG|新加坡', 'NC|新喀里多尼亚', 'NZ|新西兰', 'HU|匈牙利', 'EH|西撒哈拉', 'SY|叙利亚']
    },
    {
        key: 'Y',
        data: ['JM|牙买加', 'AM|亚美尼亚', 'YE|也门', 'IT|意大利', 'IQ|伊拉克', 'IR|伊朗', 'IN|印度', 'GB|英国', 'VG|英属维尔京群岛', 'IO|英属印度洋领地', 'ID|印尼', 'IL|以色列', 'JO|约旦', 'VN|越南']
    },
    {
        key: 'Z',
        data: ['ZM|赞比亚', 'JE|泽西岛', 'TD|乍得', 'KP|朝鲜 北朝鲜', 'GI|直布罗陀', 'CL|智利', 'CF|中非', 'CN|中国 内地']
    }]
    var hotCity = ['CN|中国', 'US|美国', 'GB|英国', 'JP|日本', 'CA|加拿大', 'FR|法国', 'KR|韩国 南朝鲜', 'DE|德国', 'AU|澳大利亚'] 
    
    
    function init() {
        var navs='<ul>'+
        // '<li><a href="javascript:;">热门</a></li>'+
        '<li><a href="javascript:;">A</a></li>'+
        '<li><a href="javascript:;">B</a></li>'+
        '<li><a href="javascript:;">C</a></li>'+
        '<li><a href="javascript:;">D</a></li>'+
        '<li><a href="javascript:;">E</a></li>'+
        '<li><a href="javascript:;">F</a></li>'+
        '<li><a href="javascript:;">G</a></li>'+
        '<li><a href="javascript:;">H</a></li>'+
        '<li><a href="javascript:;">J</a></li>'+
        '<li><a href="javascript:;">K</a></li>'+
        '<li><a href="javascript:;">L</a></li>'+
        '<li><a href="javascript:;">M</a></li>'+
        '<li><a href="javascript:;">N</a></li>'+
        '<li><a href="javascript:;">P</a></li>'+
        '<li><a href="javascript:;">Q</a></li>'+
        '<li><a href="javascript:;">R</a></li>'+
        '<li><a href="javascript:;">S</a></li>'+
        '<li><a href="javascript:;">T</a></li>'+
        '<li><a href="javascript:;">W</a></li>'+
        '<li><a href="javascript:;">X</a></li>'+
        '<li><a href="javascript:;">Y</a></li>'+
        '<li><a href="javascript:;">Z</a></li>'+
        '</ul>';

        var hotHtml = '';
        hotHtml += '<div class="tips" id="hot-tle">热门</div>';
        hotHtml += '<div class="hot hotCity">';
        $.each(hotCity,function(i, item) {
            var split = item.split('|');
            hotHtml += '<div data-id="' + split[0] + '">' + split[1] + '</div>'
        }) 
        hotHtml += '</div>';
        
        var countryhtml = '';
        $.each(cityList,function(i, item) {
            countryhtml += '<div class="city-list"><span class="city-letter" id="' + item.key + '1">' + item.key + '</span>';
            $.each(item.data,
            function(j, data) {
                var split = data.split('|');
                countryhtml += '<p data-id="' + split[0] + '">' + split[1] + '</p>';
            }) 
            countryhtml += '</div>';
        }) 
        var html='';
        html+='<div id="showLetter" class="showLetter"><span>A</span></div>'+
              '<div class="letter">'+navs+'</div>'+
              '<div class="container">'+
              '<div class="country">'+
                hotHtml+countryhtml
              '</div>'+
              '</div>'
            return html
    }
    
    
    t.fn.country=function(obj){
        var htmls=init();
        $(this).html(htmls)
        $('body').delegate(".letter li","click",function(){
            var ids=$(this).find("a").html()=="热门"?"hot-tle":$(this).find("a").html()+"1";
            var top=$("#"+ids).offset().top;
            $('html,body').animate({ scrollTop: top+'px' }, 500);
        })
        $('body').on('click', '.city-list p',
        function() {
            var data = $(this).text() + '|' + $(this).data('id');
            obj.click(data)
        });
        $('.hot.hotCity').on('click', 'div',
        function() {
            var data = $(this).text() + '|' + $(this).data('id');
            obj.click(data)
        });
        
    }
}(jQuery, window, document)