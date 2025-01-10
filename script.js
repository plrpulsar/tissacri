let web3;
const contractAddress = "0x990EEAbf7EedD47037445118CDDeC0b649f44613";
const contractABI = [
    {
        "inputs": [
            { "internalType": "address", "name": "spender", "type": "address" },
            { "internalType": "uint256", "name": "amount", "type": "uint256" }
        ],
        "name": "approve",
        "outputs": [
            { "internalType": "bool", "name": "", "type": "bool" }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "address", "name": "token", "type": "address" },
            { "internalType": "uint256", "name": "amount", "type": "uint256" }
        ],
        "name": "sacrifice",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "claimTIS",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "address", "name": "account", "type": "address" }
        ],
        "name": "balanceOf",
        "outputs": [
            { "internalType": "uint256", "name": "", "type": "uint256" }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

async function loadWeb3() {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await web3.eth.getAccounts();
        alert(Connected to: ${accounts[0]});
    } else {
        alert('MetaMask not found. Please install it.');
    }
}

document.getElementById('connectWallet').addEventListener('click', loadWeb3);

document.getElementById('sacrificeForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!web3) {
        alert('Wallet not connected');
        return;
    }

    const tokenAddress = document.getElementById('tokenSelect').value;
    const amount = document.getElementById('amount').value;
    const accounts = await web3.eth.getAccounts();

    const contract = new web3.eth.Contract(contractABI, contractAddress);
    try {
        const tokenContract = new web3.eth.Contract([
            {
                "constant": false,
                "inputs": [
                    { "name": "spender", "type": "address" },
                    { "name": "amount", "type": "uint256" }
                ],
                "name": "approve",
                "outputs": [{ "name": "", "type": "bool" }],
                "type": "function"
            }
        ], tokenAddress);

        // Approve tokens for sacrifice
        await tokenContract.methods.approve(contractAddress, web3.utils.toWei(amount)).send({ from: accounts[0] });

        // Execute sacrifice
        await contract.methods.sacrifice(tokenAddress, web3.utils.toWei(amount)).send({ from: accounts[0] });

        alert('Sacrifice successful!');
    } catch (error) {
        console.error('Error during sacrifice:', error);
        alert('Transaction failed. Check console for details.');
    }
});

document.getElementById('claimTIS').addEventListener('click', async () => {
    if (!web3) {
        alert('Wallet not connected');
        return;
    }

    const accounts = await web3.eth.getAccounts();
    const contract = new web3.eth.Contract(contractABI, contractAddress);
    try {
        await contract.methods.claimTIS().send({ from: accounts[0] });
        alert('TIS claimed successfully!');
    } catch (error) {
        console.error('Error during claim:', error);
        alert('Claim failed. Check console for details.');
    }
});
