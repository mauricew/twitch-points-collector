const loop = () => {
  const pointsContainer = document.querySelector('.community-points-summary');

  if (!pointsContainer) {
    return;
  }

  const pointsEl = pointsContainer.querySelector('.tw-align-items-center.tw-flex.tw-relative');
  /** @type {HTMLDivElement} */
  let tpcEl = pointsEl.querySelector('.tpc-message');
  if (!tpcEl) {
    tpcEl = document.createElement('div');
    tpcEl.classList.add('tpc-message', 'tw-pd-05');
    tpcEl.textContent = '✓ TPC';
    tpcEl.style.transition = 'all .25s ease';

    pointsEl.insertBefore(tpcEl, pointsEl.firstChild);

    const popupEl = document.createElement('div');
    popupEl.className = 'tw-absolute tw-balloon tw-balloon--auto tw-balloon--left tw-balloon--up tw-block';

    const innerPop = document.createElement('div');
    innerPop.className = 'tw-border-radius-large tw-c-background-base tw-c-text-inherit tw-elevation-2';
    innerPop.textContent = 'Twitch Points Collector';
    innerPop.style.height = '32rem';
    innerPop.style.width = '32rem';
    innerPop.style.display = 'flex';
    innerPop.style.justifyContent = 'center';
    innerPop.style.alignItems = 'center';
    
    //popupEl.appendChild(innerPop);
    //pointsContainer.parentElement.appendChild(popupEl);
  }

  const bonusButton = pointsContainer.querySelector('.tw-button.tw-button--success');
  if (bonusButton) {
    console.info('Clicking the bonus button!');
    bonusButton.click();
    tpcEl.classList.add('tw-alert-banner--success');

    const username = location.pathname.split('/')[0];

    chrome.storage.local.get('bonus_counter', storage => {
      const bonus_counter = {
        ...storage.bonus_counter,
        [username]: ((storage.bonus_counter.xqcow) || 0) + 1
      };

      chrome.storage.local.set({ bonus_counter }, () => console.log(bonus_counter));
    });
    
    setTimeout(() => {
      tpcEl.classList.remove('tw-alert-banner--success', 'tw-strong');
    }, 3000);
  }
};

setTimeout(loop, 1000);
setInterval(loop, 5000);

