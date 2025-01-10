let web3;
const contractAddress = "0x990EEAbf7EedD47037445118CDDeC0b649f44613";
const contractABI = [
    // ABI content here
];

document.getElementById('connectWallet').addEventListener('click', async () => {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await web3.eth.getAccounts();
        alert(Connected to: ${accounts[0]});
    } else {
        alert('MetaMask not found');
    }
});

document.getElementById('sacrificeForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const tokenAddress = document.getElementById('tokenSelect').value;
    const amount = document.getElementById('amount').value;
    const accounts = await web3.eth.getAccounts();

    const contract = new web3.eth.Contract(contractABI, contractAddress);
    await contract.methods.sacrifice(tokenAddress, web3.utils.toWei(amount)).send({ from: accounts[0] });
    alert('Sacrifice successful!');
});

document.getElementById('claimTIS').addEventListener('click', async () => {
    const accounts = await web3.eth.getAccounts();
    const contract = new web3.eth.Contract(contractABI, contractAddress);
    await contract.methods.claimTIS().send({ from: accounts[0] });
    alert('TIS claimed!');
});
