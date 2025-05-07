// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract CertificateNFT is ERC721URIStorage, Ownable {
    uint256 public nextTokenId;

    constructor() ERC721("CertificateNFT", "CNFT") {}

    function mintCertificate(address recipient, string memory tokenURI) public onlyOwner {
        uint256 tokenId = nextTokenId;
        _safeMint(recipient, tokenId);
        _setTokenURI(tokenId, tokenURI);
        nextTokenId++;
    }

    function batchMint(address[] calldata recipients, string[] calldata tokenURIs) external onlyOwner {
        require(recipients.length == tokenURIs.length, "Length mismatch");
        for (uint256 i = 0; i < recipients.length; i++) {
            mintCertificate(recipients[i], tokenURIs[i]);
        }
    }
}
