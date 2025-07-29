const generateButton = document.getElementById('generate-list');

//input args
let id_client = document.getElementById('id_client').value;
let mcc = document.getElementById('mcc').value;
let mnc_list = document.getElementById('mnc_list').value;
let sender = document.getElementById('sender').value;
let patterns = document.getElementById('patterns').value;
let priority = document.getElementById('priority').value;
let id_partners_pool = document.getElementById('id_partners_pool').value;


function generateRoutingTemplateSQL({
    id_client,
    mcc,
    mnc_list,
    sender,
    patterns,
    priority,
    id_partners_pool,
}) {
    // Разбиваем входные данные на массивы
    const mncs = mnc_list.trim().split(/\s+/).filter(Boolean);
    const prio = priority;
    const partnerPool = id_partners_pool;
    const senderOut = sender;
    const patternList = patterns.trim().split('\n')
        .map(p => p.trim())
        .filter(Boolean)
        .map(p => p.replace(/'/g, "''"));  // Экранирование одинарных кавычек

    if (mncs.length === 0) throw new Error('MNC list is empty');
    if (patternList.length === 0) throw new Error('Patterns are empty');

    // 1. Генерация SQL для вставки правил
    const rulesValues = mncs.map(mnc => 
        `(${id_client}, '${mcc}', '${mnc}', ${partnerPool}, 0, ${prio}, '${senderOut}', 'any', 0, 'any', NULL)`
    ).join(',\n    ');

    const rulesSQL = `INSERT INTO routing_rules (
    id_client, MCC, MNC, id_partners_pool, 
    id_senders_pool, priority, sender, 
    ported, mnp_hlr, type, comment
) VALUES 
    ${rulesValues};
`;

    // 2. Генерация SQL для вставки текстовых шаблонов
    const textSQLs = [];
    for (let i = 0; i < mncs.length; i++) {
        const ruleIndex = i;
        const textValues = patternList.map(pattern => 
            `(@rule_id_${ruleIndex}, '${pattern}')`
        ).join(',\n        ');
        
        textSQLs.push(`-- Для правила ${ruleIndex + 1} (MCC: ${mcc}, MNC: ${mncs[i]})
INSERT INTO routing_text (id_rule, pattern) 
VALUES 
        ${textValues};
`);
    }

    // 3. Генерация полного SQL-скрипта
    return `-- [1/3] Создаем временные переменные для ID правил
SET @first_rule_id = 0;
${mncs.map((_, i) => `SET @rule_id_${i} = 0;`).join('\n')}

-- [2/3] Вставляем правила маршрутизации
${rulesSQL}

-- Сохраняем первый ID
SET @first_rule_id = LAST_INSERT_ID();

-- Устанавливаем ID для каждого правила
${mncs.map((_, i) => `SET @rule_id_${i} = @first_rule_id + ${i};`).join('\n')}

-- [3/3] Вставляем текстовые шаблоны
${textSQLs.join('\n')}

-- Проверка результатов
SELECT 
    (SELECT COUNT(*) FROM routing_rules WHERE id_rule >= @first_rule_id) AS rules_created,
    (SELECT COUNT(*) FROM routing_text WHERE id_rule >= @first_rule_id) AS patterns_created;
`;
}

// Пример использования
// const sqlScript = generateRoutingTemplateSQL({
//     id_client: 2310,
//     mcc: '250',
//     mnc_list: '01 02 11 20 39 62 99',
//     sender: 'Bitget',
//     patterns: `[Bitget] Код подтверждения для нового устройства: 405713; Место входа: Russia-St.-Petersburg-St Petersburg; IP-адрес: 95.54.220.225
// [Bitget] Проверочный код: 388954. Вы привязываете Google Authenticator.`
// });

//start generating subs based on cc and codelength button click event
generateButton.addEventListener('click', e => {
    console.log(id_client);
    console.log(e);
    console.log(e);
    console.log(e);
    console.log(e);
    const sqlScript = generateRoutingTemplateSQL();
    console.log(sqlScript);
})

