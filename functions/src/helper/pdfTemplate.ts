/* eslint-disable max-len */
import {format} from "date-fns";

export const getPdfTemplate = (data: any) => {
  const {
    createdAt, city, state, addressLine1, postCode,
    reportId, images,
  } = data;

  type Photo = {
    storagePath: string;
    createdAt: string;
  };
  const sectionHTML = Object.entries(images).map(([spaceName, types]) => {
    const t = types as { general: Photo[]; issue: Photo[], issueSummary: string };
    const totalGeneral = t.general.length;
    const totalIssues = t.issue.length;

    const generalImagesHTML = t.general.map((img) => `
      <div class="photo">
        <img src="${img.storagePath}" alt="${spaceName} General Photo">
        <span>${format(new Date(img.createdAt), "dd/MM/yyyy HH:mm")}</span>
      </div>
    `).join("");

    const issueImagesHTML = t.issue.map((img) => `
      <div class="photo">
        <img class="issue-photo" src="${img.storagePath}" alt="${spaceName} Issue Photo">
        <span>${format(new Date(img.createdAt), "dd/MM/yyyy HH:mm")}</span>
      </div>
    `).join("");

    return `
    <div class="section">
      <div style="display: flex; justify-content: space-between; padding-bottom: 15px;">
        <h2>${spaceName}</h2>
        <div style="display: flex; justify-content: space-between; gap: 40px;">
          <div>
            <h2>${totalGeneral}</h2>
            <p>Photos captured</p>
          </div>
          <div>
            <h2>${totalIssues}</h2>
            <p>Issues logged</p>
          </div>
        </div>
      </div>
      
      ${totalGeneral > 0 ? `
        <p style="padding-bottom: 14px;"><strong style="color: black;">General photos of the space—</strong>Captured to show overall space condition</p>
        <div class="photos">
          ${generalImagesHTML}
        </div>
      ` : ""}
  
      ${totalIssues > 0 ? `
        <p style="padding-bottom: 14px;"><strong style="color: black;">Issues found in this space—</strong>Identified and recorded for reference.</p>

        <div class="issues">
          <div class="vert-line" style="height: 15px; background-color: #FE3B34;"></div>
          <p><strong>${t.issueSummary}</strong></p>
        </div>
        <div class="photos">
          ${issueImagesHTML}
        </div>
      ` : ""}
    </div>
    `;
  }).join("");

  return `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Property Condition Report</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
    }

    .container {
      padding: 30px;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
    }

    .header img {
      height: 50px;
    }

    .header h1 {
      font-size: 24px;
      color: #333;
    }

    .header p {
      font-size: 12px;
      color: #777;
    }

    .header div {
      display: flex;
      flex-direction: column;
      align-items: end;
    }

    .section-header{
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 2px solid #ccc;
      padding-bottom: 28px;
      margin-bottom: 25px;
    }

    .section h2 {
      font-size: 16px;
      color: #333;
      margin-bottom: 2px;
    }

    .section p {
      font-size: 14px;
      color: #666;
      margin: 0;
    }

    .section {
      padding-bottom: 14px;
    }

    .photos {
      display: grid;
      grid-template-columns: repeat(4, 130px);
      width: 100%;
      justify-content: space-between;
      gap: 10px;
      margin-bottom: 20px;
    }

    .photo {
      width: 130px;
      height: 158px;
      gap: 10px;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-bottom: 10px;
    }

    .photo img {
      width: 100%;
      height: 100%;
      border-radius: 10px;
      background: lightgray 50% / cover no-repeat;
    }

    .issues {
      margin-top: 10px;
      padding: 10px;
      background-color: #f8d7da;
      color: #721c24;
      border-radius: 5px;
      margin-bottom: 14px;
      display: flex;

    }

    .issue-photo {
      border: 1.5px dashed #FE3B34;
    }

    .vert-line {
      width: 2px;
      height: 100%;
      border-radius: 10px;
      margin-left: 5px;
      margin-right: 5px;
    }

    .footer {
      font-size: 12px;
      text-align: center;
      margin-top: 40px;
    }
  </style>
</head>

<body>
  <div class="container">
    <div class="header">
      <svg xmlns="http://www.w3.org/2000/svg" width="150" height="40" viewBox="0 0 376 103" fill="none">
        <path d="M361.359 2.06549L376 100.419H349.817L348.541 82.7411H339.368L337.849 100.419H311.362L324.363 2.06549H361.359ZM347.812 65.3059C346.516 54.1685 345.22 40.4188 343.924 24.0569C341.332 42.8488 339.712 56.5985 339.064 65.3059H347.812Z" fill="black"/>
        <path d="M309.52 2.06549V100.419H287.164V34.0198L278.234 100.419H262.378L252.962 35.5386V100.419H230.606V2.06549H263.715C264.687 7.97846 265.719 14.9444 266.813 22.9634L270.336 47.9923L276.168 2.06549H309.52Z" fill="black"/>
        <path d="M223.599 59.6562C223.599 69.5382 223.356 76.5446 222.87 80.6756C222.425 84.7661 220.967 88.5123 218.496 91.9143C216.066 95.3163 212.766 97.9285 208.594 99.751C204.423 101.574 199.563 102.485 194.014 102.485C188.749 102.485 184.011 101.634 179.799 99.9333C175.627 98.1918 172.266 95.5998 169.714 92.1573C167.163 88.7148 165.644 84.9686 165.158 80.9186C164.672 76.8686 164.429 69.7812 164.429 59.6562V42.8285C164.429 32.9466 164.652 25.9604 165.097 21.8699C165.583 17.7389 167.041 13.9724 169.471 10.5704C171.942 7.16847 175.263 4.55623 179.434 2.73374C183.606 0.911246 188.466 0 194.014 0C199.279 0 203.998 0.870746 208.169 2.61224C212.381 4.31323 215.763 6.88497 218.314 10.3275C220.866 13.7699 222.384 17.5162 222.87 21.5661C223.356 25.6161 223.599 32.7036 223.599 42.8285V59.6562ZM198.024 27.3374C198.024 22.7609 197.761 19.8449 197.234 18.5894C196.748 17.2934 195.715 16.6454 194.136 16.6454C192.799 16.6454 191.767 17.1719 191.038 18.2249C190.349 19.2374 190.005 22.2749 190.005 27.3374V73.2642C190.005 78.9746 190.228 82.4981 190.673 83.8346C191.159 85.1711 192.253 85.8393 193.954 85.8393C195.695 85.8393 196.809 85.0698 197.295 83.5309C197.781 81.9919 198.024 78.3266 198.024 72.5352V27.3374Z" fill="black"/>
        <path d="M158.152 59.6562C158.152 69.5382 157.909 76.5446 157.423 80.6756C156.977 84.7661 155.519 88.5123 153.049 91.9143C150.619 95.3163 147.318 97.9285 143.146 99.751C138.975 101.574 134.115 102.485 128.567 102.485C123.302 102.485 118.563 101.634 114.351 99.9333C110.18 98.1918 106.818 95.5998 104.267 92.1573C101.715 88.7148 100.196 84.9686 99.7104 80.9186C99.2244 76.8686 98.9814 69.7812 98.9814 59.6562V42.8285C98.9814 32.9466 99.2042 25.9604 99.6497 21.8699C100.136 17.7389 101.594 13.9724 104.024 10.5704C106.494 7.16847 109.815 4.55623 113.987 2.73374C118.158 0.911246 123.018 0 128.567 0C133.832 0 138.55 0.870746 142.721 2.61224C146.933 4.31323 150.315 6.88497 152.866 10.3275C155.418 13.7699 156.937 17.5162 157.423 21.5661C157.909 25.6161 158.152 32.7036 158.152 42.8285V59.6562ZM132.576 27.3374C132.576 22.7609 132.313 19.8449 131.786 18.5894C131.3 17.2934 130.268 16.6454 128.688 16.6454C127.352 16.6454 126.319 17.1719 125.59 18.2249C124.901 19.2374 124.557 22.2749 124.557 27.3374V73.2642C124.557 78.9746 124.78 82.4981 125.225 83.8346C125.711 85.1711 126.805 85.8393 128.506 85.8393C130.247 85.8393 131.361 85.0698 131.847 83.5309C132.333 81.9919 132.576 78.3266 132.576 72.5352V27.3374Z" fill="black"/>
        <path d="M94 100V2H67.315V37.0775L54.5751 2H38.3919V34.5461L26.685 2H0L34.4322 100H54.5751V68.9004L68.6923 100H94Z" fill="black"/>
      </svg>
      
      <div>
        <h1>Property Condition Report</h1>
        <p>Report ID: <strong style="color: black;">${reportId}</strong></p>
      </div>
    </div>

    <div class="section section-header">
      <div style="width: 40%">
        <div>
          <h2>${addressLine1}, ${city}, ${state}, ${postCode}</h2>
          <p>Property address</p>
        </div>
        <div>
          <h2>${format(new Date(createdAt), "dd/MM/yyyy")}</h2>
          <p>Report date</p>
        </div>
      </div>
      <div style="display: flex; width: 40%; border-radius: 10px; background-color: #F8F8F8; padding: 1em;">
        <p style="border-left: 2px solid #B8B8B8; padding-left: 10px;">
          This report provides a structured, timestamped record of the property's condition at move-in.
          No modifications can be made after generation. For full-resolution images, click any image or visit:
          <a href="#" target="_blank" style="color: black; text-decoration: none;"><strong>wooma.com/${reportId}</strong></a>
        </p>
      </div>
    </div>

    ${ sectionHTML }

  </div>
</body>

</html>
`;
};
