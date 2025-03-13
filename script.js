function formatMessage(text) {
    if (!text) return '';

    // 处理标题和换行
    let lines = text.split('\n');
    let formattedLines = lines.map(line => {
        // 处理标题（**文本**）
        line = line.replace(/\*\*(.*?)\*\*/g, '<span class="bold-text">$1</span>');
        return line;
    });

    // 将 ### 替换为换行，并确保每个部分都是一个段落
    let processedText = formattedLines.join('\n');
    let sections = processedText
        .split('###')
        .filter(section => section.trim())
        .map(section => {
            // 移除多余的换行和空格
            let lines = section.split('\n').filter(line => line.trim());

            if (lines.length === 0) return '';

            // 处理每个部分
            let result = '';
            let currentIndex = 0;

            while (currentIndex < lines.length) {
                let line = lines[currentIndex].trim();

                // 如果是数字开头（如 "1.")
                if (/^\d+\./.test(line)) {
                    result += `<p class="section-title">${line}</p>`;
                }
                // 如果是小标题（以破折号开头）
                else if (line.startsWith('-')) {
                    result += `<p class="subsection"><span class="bold-text">${line.replace(/^-/, '').trim()}</span></p>`;
                }
                // 如果是正文（包含冒号的行）
                else if (line.includes(':')) {
                    let [subtitle, content] = line.split(':').map(part => part.trim());
                    result += `<p><span class="subtitle">${subtitle}</span>: ${content}</p>`;
                }
                // 普通文本
                else {
                    result += `<p>${line}</p>`;
                }
                currentIndex++;
            }
            return result;
        });

    return sections.join('');
}

function displayMessage(role, message) {
    const messagesContainer = document.getElementById('messages');
    const messageElement = document.createElement('div');
    messageElement.className = `message ${role}`;

    const avatar = document.createElement('img');
    avatar.src = role === 'user' ? 'user-avatar.png' : 'bot-avatar.png';
    avatar.alt = role === 'user' ? 'User' : 'Bot';

    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';

    // 用户消息直接显示，机器人消息需要格式化
    messageContent.innerHTML = role === 'user' ? message : formatMessage(message);

    messageElement.appendChild(avatar);
    messageElement.appendChild(messageContent);
    messagesContainer.appendChild(messageElement);

    // 平滑滚动到底部
    messageElement.scrollIntoView({ behavior: 'smooth' });
}

function sendMessage() {
    const inputElement = document.getElementById('chat-input');
    const message = inputElement.value;
    if (!message.trim()) return;

    // 显示用户消息
    displayMessage('user', message);
    inputElement.value = '';

    // 显示加载动画
    const loadingElement = document.getElementById('loading');
    if (loadingElement) {
        loadingElement.style.display = 'block';
    }

    // 提示消息的内容
    const prompt1 = "你是中央财经大学轻碳致行团队开发的，该团队均是碳中和科研组核心成员，团队成员包括：马卓群，杨宸熙，张昕田，吴宛宸,谢沁彤。他们致力于帮助企业完成绿色转型，进行一站式AI碳管理工作。";
    const prompt2 = "团队成员的个人信息如下：首席执行官兼首席技术官（CEO&CTO）马卓群，中央财经大学管理科学与工程学院2023级投资学本科生，负责统筹公司战略规划与管理，把控技术方向，推动技术创新，保持平台技术领先，曾获全面发展奖学金、学术科研与创新奖学金等，担任校博弈社社长等职，获多项创新创业与社会实践奖项，及美育方面荣誉；首席运营官（COO）杨宸熙，同专业2023级本科生，负责公司日常运营管理，制定运营策略，建立监督机制，推进管理创新，曾获国家奖学金等多项奖学金，成绩专业排名第一，现任投资学23-2班班长等职，获学科竞赛、文艺活动多项奖项，受邀参加2024年中财大樟树秋季养老论坛，参与大创项目及社会实践等；首席营销官（CSO）谢沁彤，同专业2023级本科生，负责市场拓展与销售管理，制定销售战略，加强客户关系管理，扩大市场份额，获美育专项奖学金，现任社团指导部分管委员，曾任院组织部干事，获新文科实践创新大赛国家级银奖等，有军训训练标兵、优秀团员等荣誉；首席人事官（CHO）张昕田，投资学专业本科生，负责统筹人力资源体系建设，构建人才机制，营造企业文化，加强人才梯队建设，曾获全面发展奖学金、德育优秀奖学金，现为院团委新闻与宣传中心负责人、校报特约作者，有创新创业比赛、行研大赛经验，参与大创、社会实践和科研项目，参加中财大樟树秋季养老论坛、第九届中财校友新年论坛等；首席财务官（CFO）吴宛宸，同专业2023级本科生，中国新市场财政发展协同创新中心2024级实验班成员，负责主持财务战略规划与管理，健全财务体系，制定预算，防范风险，专业排名第二，曾获校级三好学生等荣誉，获全国大学生英语竞赛三等奖等，实践经历丰富，参与多项活动，具备较好英语、数据处理与抗压能力。"

    // 将提示消息作为用户消息的一部分发送
    const correctedMessage = prompt1 +prompt2 "\n" + message; // 将提示消息和用户消息结合

    const apiKey = 'sk-358a56cafab94694be745e3f513f10e8';

    // 其余代码不变
    const endpoint = 'https://api.deepseek.com/chat/completions';

    const payload = {
        model: "deepseek-chat",
        messages: [
            { role: "system", content: "You are a helpful assistant" },
            { role: "user", content: correctedMessage } // 使用结合后的消息
        ],
        stream: false
    };

    fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(payload)
    })
    .then(response => response.json())
    .then(data => {
        // 隐藏加载动画
        if (loadingElement) {
            loadingElement.style.display = 'none';
        }

        if (data.choices && data.choices.length > 0) {
            displayMessage('bot', data.choices[0].message.content);
        } else {
            displayMessage('bot', '出错了，请稍后再试。');
        }
    })
    .catch(error => {
        // 隐藏加载动画
        if (loadingElement) {
            loadingElement.style.display = 'none';
        }

        displayMessage('bot', '出错了，请稍后再试。');
        console.error('Error:', error);
    });
}

// 添加主题切换功能
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const chatContainer = document.querySelector('.chat-container');
    const messages = document.querySelector('.messages');

    // 同时切换容器的深色模式
    chatContainer.classList.toggle('dark-mode');
    messages.classList.toggle('dark-mode');

    // 保存主题设置
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
}

// 页面加载时检查主题设置
document.addEventListener('DOMContentLoaded', () => {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        document.querySelector('.chat-container').classList.add('dark-mode');
        document.querySelector('.messages').classList.add('dark-mode');
    }
});

// 添加下拉菜单功能
function toggleDropdown(event) {
    event.preventDefault();
    document.getElementById('dropdownMenu').classList.toggle('show');
}

// 点击其他地方关闭下拉菜单
window.onclick = function(event) {
    if (!event.target.matches('.dropdown button')) {
        const dropdowns = document.getElementsByClassName('dropdown-content');
        for (const dropdown of dropdowns) {
            if (dropdown.classList.contains('show')) {
                dropdown.classList.remove('show');
            }
        }
    }
};

// 添加回车发送功能
document.getElementById('chat-input').addEventListener('keypress', function(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
});
