const axios = require('axios').default;
const cron = require('node-cron');
const notifier = require('node-notifier');

var scheduler = cron.schedule('*/3 * * * * *', function () {
    console.log('Checked at: ', new Date());
    checkAvailability();
});

function checkAvailability() {
    const options = { headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.54 Safari/537.36' } };

    axios.get('https://reserve-prime.apple.com/AE/en_AE/reserve/A/availability.json', options)
        .then(res => {
            const stores = [
                'R597', // Dubai Mall
                'R596', // Mall of the Emirates
            ];
            const models = [
                'MLL93AA/A', // iPhone 13 Pro Max Sierra Blue 128GB
                'MLLE3AA/A', // iPhone 13 Pro Max Sierra Blue 256GB
                'MLVU3AA/A', // iPhone 13 Pro Max Sierra Blue 512GB
            ];
            const data = res.data;

            stores.map(store => {
                models.map(model => {
                    if (data.stores[store][model].availability.unlocked) {
                        showNotification(store, model);
                        scheduler.stop();
                        return;
                    };
                });
            });
        });
}

function showNotification(store, model) {
    notifier.notify({
        title: 'Apple Store',
        message: 'You have a new iPhone 13 Pro Max Sierra Blue',
        open: `https://reserve-prime.apple.com/AE/en_AE/reserve/A/availability?&store=${store}&iUP=N&appleCare=N&rv=0&partNumber=${model}`,
        sound: true,
        wait: true,
    });
}
