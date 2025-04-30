/* eslint-disable max-len */
export const getPdfTemplate = (data: any) => {
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
      height: 130px;
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
      <svg width="133" height="23" viewBox="0 0 133 23" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_228_697)">
        <path d="M35.3115 0.469849L29.6058 22.5893H20.8278L17.7156 9.18356L14.4837 22.5893H5.74563L0.079834 0.469849H7.86033L10.374 15.1373L13.6857 0.469849H22.0647L25.4961 15.1767L27.9699 0.469849H35.3115ZM42.7637 22.8653C40.5291 22.8653 38.5208 22.4053 36.7386 21.4853C34.983 20.5653 33.5998 19.251 32.589 17.5424C31.5782 15.8338 31.0728 13.823 31.0728 11.5098C31.0728 9.22299 31.5782 7.22528 32.589 5.51671C33.6264 3.80813 35.0229 2.49385 36.7785 1.57385C38.5607 0.653849 40.569 0.193848 42.8036 0.193848C45.038 0.193848 47.033 0.653849 48.7886 1.57385C50.5708 2.49385 51.9673 3.80813 52.9781 5.51671C54.0155 7.22528 54.5342 9.22299 54.5342 11.5098C54.5342 13.7967 54.0155 15.8076 52.9781 17.5424C51.9673 19.251 50.5708 20.5653 48.7886 21.4853C47.0064 22.4053 44.9981 22.8653 42.7637 22.8653ZM42.7637 16.1624C43.8543 16.1624 44.7587 15.7681 45.4769 14.9796C46.2217 14.1647 46.5941 13.0081 46.5941 11.5098C46.5941 10.0116 46.2217 8.86813 45.4769 8.07956C44.7587 7.29099 43.8676 6.89671 42.8036 6.89671C41.7396 6.89671 40.8483 7.29099 40.1301 8.07956C39.4119 8.86813 39.0528 10.0116 39.0528 11.5098C39.0528 13.0344 39.3986 14.191 40.0902 14.9796C40.7818 15.7681 41.6731 16.1624 42.7637 16.1624ZM62.9427 22.8653C60.7083 22.8653 58.7 22.4053 56.9178 21.4853C55.1622 20.5653 53.779 19.251 52.7682 17.5424C51.7574 15.8338 51.252 13.823 51.252 11.5098C51.252 9.22299 51.7574 7.22528 52.7682 5.51671C53.8056 3.80813 55.2021 2.49385 56.9577 1.57385C58.7399 0.653849 60.7482 0.193848 62.9826 0.193848C65.217 0.193848 67.212 0.653849 68.9676 1.57385C70.7498 2.49385 72.1463 3.80813 73.1571 5.51671C74.1945 7.22528 74.7132 9.22299 74.7132 11.5098C74.7132 13.7967 74.1945 15.8076 73.1571 17.5424C72.1463 19.251 70.7498 20.5653 68.9676 21.4853C67.1854 22.4053 65.1771 22.8653 62.9427 22.8653ZM62.9427 16.1624C64.0333 16.1624 64.9377 15.7681 65.6559 14.9796C66.4007 14.1647 66.7731 13.0081 66.7731 11.5098C66.7731 10.0116 66.4007 8.86813 65.6559 8.07956C64.9377 7.29099 64.0466 6.89671 62.9826 6.89671C61.9186 6.89671 61.0275 7.29099 60.3093 8.07956C59.5911 8.86813 59.232 10.0116 59.232 11.5098C59.232 13.0344 59.5778 14.191 60.2694 14.9796C60.961 15.7681 61.8521 16.1624 62.9427 16.1624ZM101.955 0.272704C104.774 0.272704 106.982 1.11385 108.578 2.79613C110.201 4.47842 111.012 6.77842 111.012 9.69613V22.5893H103.191V10.7213C103.191 9.53842 102.859 8.61842 102.194 7.96128C101.529 7.30413 100.625 6.97556 99.4807 6.97556C98.3369 6.97556 97.4325 7.30413 96.7675 7.96128C96.1025 8.61842 95.77 9.53842 95.77 10.7213V22.5893H87.9496V10.7213C87.9496 9.53842 87.6171 8.61842 86.9521 7.96128C86.3137 7.30413 85.4226 6.97556 84.2788 6.97556C83.1084 6.97556 82.1907 7.30413 81.5257 7.96128C80.8607 8.61842 80.5282 9.53842 80.5282 10.7213V22.5893H72.7078V0.469849H80.5282V3.38756C81.2198 2.44128 82.1109 1.69213 83.2015 1.14013C84.3187 0.561849 85.5955 0.272704 87.0319 0.272704C88.6811 0.272704 90.1441 0.627563 91.4209 1.33728C92.7243 2.04699 93.7484 3.04585 94.4932 4.33385C95.2912 3.12471 96.3419 2.15213 97.6453 1.41613C98.9487 0.653849 100.385 0.272704 101.955 0.272704ZM108.833 11.5098C108.833 9.22299 109.245 7.22528 110.07 5.51671C110.921 3.80813 112.065 2.49385 113.501 1.57385C114.964 0.653849 116.587 0.193848 118.369 0.193848C119.912 0.193848 121.242 0.496134 122.359 1.10071C123.476 1.70528 124.34 2.52013 124.952 3.54528V0.469849H132.773V22.5893H124.952V19.5138C124.34 20.539 123.463 21.3538 122.319 21.9584C121.202 22.563 119.885 22.8653 118.369 22.8653C116.587 22.8653 114.964 22.4053 113.501 21.4853C112.065 20.5653 110.921 19.251 110.07 17.5424C109.245 15.8076 108.833 13.7967 108.833 11.5098ZM124.952 11.5098C124.952 10.0904 124.553 8.97328 123.755 8.15842C122.984 7.34356 122.026 6.93613 120.882 6.93613C119.712 6.93613 118.741 7.34356 117.97 8.15842C117.198 8.94699 116.813 10.0641 116.813 11.5098C116.813 12.9293 117.198 14.0596 117.97 14.9007C118.741 15.7156 119.712 16.123 120.882 16.123C122.026 16.123 122.984 15.7156 123.755 14.9007C124.553 14.0858 124.952 12.9556 124.952 11.5098Z" fill="#111717"/>
        <ellipse cx="44.1202" cy="12.1389" rx="2.55769" ry="2.55556" fill="#111717"/>
        <ellipse cx="64.5817" cy="12.1389" rx="2.55769" ry="2.55556" fill="#111717"/>
        </g>
        <defs>
        <clipPath id="clip0_228_697">
        <rect width="133" height="23" fill="white"/>
        </clipPath>
        </defs>
      </svg>
      
      <div>
        <h1>Property Condition Report</h1>
        <p>Report ID: <strong style="color: black;">WOOMA-2025-001234</strong></p>
      </div>
    </div>

    <div class="section section-header">
      <div style="width: 40%">
        <div>
          <h2>Alex Johnson</h2>
          <p>Tenant(s)</p>
        </div>
        <div>
          <h2>123 High Street, London, W1A 1AA</h2>
          <p>Property address</p>
        </div>
        <div>
          <h2>10/08/2025</h2>
          <p>Report date</p>
        </div>
      </div>
      <div style="display: flex; width: 40%; border-radius: 10px; background-color: #F8F8F8; padding: 1em;">
        <p style="border-left: 2px solid #B8B8B8; padding-left: 10px;">
          This report provides a structured, timestamped record of the property's condition at move-in.
          No modifications can be made after generation. For full-resolution images, click any image or visit:
          <a href="#" target="_blank" style="color: black; text-decoration: none;"><strong>wooma.com/[reportID]</strong></a>
        </p>
      </div>
    </div>

    <div class="section">
      <div style="display: flex; justify-content: space-between; padding-bottom: 15px;">
        <h2>Kitchen</h2>
        <div style="display: flex; justify-content: space-between; gap: 40px;">
          <div>
            <h2>46</h2>
            <p>Photos captured</p>
          </div>
          <div>
            <h2>4</h2>
            <p>Issues logged</p>
          </div>
        </div>
      </div>
      <p style="padding-bottom: 14px;"><strong style="color: black;">General photos of the space—</strong>Captured to show overall space condition</p>
      
      <div class="photos">
        <div class="photo">
          <img src="https://firebasestorage.googleapis.com/v0/b/wooma-488f1.firebasestorage.app/o/1.PNG?alt=media&token=43224910-f89f-4881-9114-dcf1407624df" alt="Kitchen Photo 1">
        </div>
        <div class="photo">
          <img src="https://firebasestorage.googleapis.com/v0/b/wooma-488f1.firebasestorage.app/o/1.PNG?alt=media&token=43224910-f89f-4881-9114-dcf1407624df" alt="Kitchen Photo 1">
        </div>
        <div class="photo">
          <img src="https://firebasestorage.googleapis.com/v0/b/wooma-488f1.firebasestorage.app/o/1.PNG?alt=media&token=43224910-f89f-4881-9114-dcf1407624df" alt="Kitchen Photo 1">
        </div>
        <div class="photo">
          <img src="https://firebasestorage.googleapis.com/v0/b/wooma-488f1.firebasestorage.app/o/1.PNG?alt=media&token=43224910-f89f-4881-9114-dcf1407624df" alt="Kitchen Photo 1">
        </div>
      </div>

      <p style="padding-bottom: 14px;"><strong style="color: black;">Issues found in this space—</strong>Identified and recorded for reference.</p>
      <div class="issues">
        <div class="vert-line" style="height: 15px; background-color: #FE3B34;"></div>
        <p><strong>Windows—HANDLE NOT WORKING. WINDOW DOES NOT OPEN.</strong></p>
      </div>

      <div class="photos">
        <div class="photo">
          <img class="issue-photo" src="https://firebasestorage.googleapis.com/v0/b/wooma-488f1.firebasestorage.app/o/1.PNG?alt=media&token=43224910-f89f-4881-9114-dcf1407624df" alt="Kitchen Photo 1">
        </div>
        <div class="photo">
          <img class="issue-photo" src="https://firebasestorage.googleapis.com/v0/b/wooma-488f1.firebasestorage.app/o/1.PNG?alt=media&token=43224910-f89f-4881-9114-dcf1407624df" alt="Kitchen Photo 1">
        </div>
        <div class="photo">
          <img class="issue-photo" src="https://firebasestorage.googleapis.com/v0/b/wooma-488f1.firebasestorage.app/o/1.PNG?alt=media&token=43224910-f89f-4881-9114-dcf1407624df" alt="Kitchen Photo 1">
        </div>
        <div class="photo">
          <img class="issue-photo" src="https://firebasestorage.googleapis.com/v0/b/wooma-488f1.firebasestorage.app/o/1.PNG?alt=media&token=43224910-f89f-4881-9114-dcf1407624df" alt="Kitchen Photo 1">
        </div>

        <div class="photo">
          <img class="issue-photo" src="https://firebasestorage.googleapis.com/v0/b/wooma-488f1.firebasestorage.app/o/1.PNG?alt=media&token=43224910-f89f-4881-9114-dcf1407624df" alt="Kitchen Photo 1">
        </div>
        <div class="photo">
          <img class="issue-photo" src="https://firebasestorage.googleapis.com/v0/b/wooma-488f1.firebasestorage.app/o/1.PNG?alt=media&token=43224910-f89f-4881-9114-dcf1407624df" alt="Kitchen Photo 1">
        </div>
        <div class="photo">
          <img class="issue-photo" src="https://firebasestorage.googleapis.com/v0/b/wooma-488f1.firebasestorage.app/o/1.PNG?alt=media&token=43224910-f89f-4881-9114-dcf1407624df" alt="Kitchen Photo 1">
        </div>
      </div>
    </div>

    <div class="section">
      <div style="display: flex; justify-content: space-between; padding-bottom: 15px;">
        <h2>Kitchen</h2>
        <div style="display: flex; justify-content: space-between; gap: 40px;">
          <div>
            <h2>46</h2>
            <p>Photos captured</p>
          </div>
          <div>
            <h2>4</h2>
            <p>Issues logged</p>
          </div>
        </div>
      </div>
      <p style="padding-bottom: 14px;"><strong style="color: black;">General photos of the space—</strong>Captured to show overall space condition</p>
      
      <div class="photos">
        <div class="photo">
          <img src="https://firebasestorage.googleapis.com/v0/b/wooma-488f1.firebasestorage.app/o/1.PNG?alt=media&token=43224910-f89f-4881-9114-dcf1407624df" alt="Kitchen Photo 1">
        </div>
        <div class="photo">
          <img src="https://firebasestorage.googleapis.com/v0/b/wooma-488f1.firebasestorage.app/o/1.PNG?alt=media&token=43224910-f89f-4881-9114-dcf1407624df" alt="Kitchen Photo 1">
        </div>
        <div class="photo">
          <img src="https://firebasestorage.googleapis.com/v0/b/wooma-488f1.firebasestorage.app/o/1.PNG?alt=media&token=43224910-f89f-4881-9114-dcf1407624df" alt="Kitchen Photo 1">
        </div>
        <div class="photo">
          <img src="https://firebasestorage.googleapis.com/v0/b/wooma-488f1.firebasestorage.app/o/1.PNG?alt=media&token=43224910-f89f-4881-9114-dcf1407624df" alt="Kitchen Photo 1">
        </div>
      </div>

      <p style="padding-bottom: 14px;"><strong style="color: black;">Issues found in this space—</strong>Identified and recorded for reference.</p>
      <div class="issues">
        <div class="vert-line" style="height: 15px; background-color: #FE3B34;"></div>
        <p><strong>Windows—HANDLE NOT WORKING. WINDOW DOES NOT OPEN.</strong></p>
      </div>

      <div class="photos">
        <div class="photo">
          <img class="issue-photo" src="https://firebasestorage.googleapis.com/v0/b/wooma-488f1.firebasestorage.app/o/1.PNG?alt=media&token=43224910-f89f-4881-9114-dcf1407624df" alt="Kitchen Photo 1">
        </div>
        <div class="photo">
          <img class="issue-photo" src="https://firebasestorage.googleapis.com/v0/b/wooma-488f1.firebasestorage.app/o/1.PNG?alt=media&token=43224910-f89f-4881-9114-dcf1407624df" alt="Kitchen Photo 1">
        </div>
        <div class="photo">
          <img class="issue-photo" src="https://firebasestorage.googleapis.com/v0/b/wooma-488f1.firebasestorage.app/o/1.PNG?alt=media&token=43224910-f89f-4881-9114-dcf1407624df" alt="Kitchen Photo 1">
        </div>
        <div class="photo">
          <img class="issue-photo" src="https://firebasestorage.googleapis.com/v0/b/wooma-488f1.firebasestorage.app/o/1.PNG?alt=media&token=43224910-f89f-4881-9114-dcf1407624df" alt="Kitchen Photo 1">
        </div>

        <div class="photo">
          <img class="issue-photo" src="https://firebasestorage.googleapis.com/v0/b/wooma-488f1.firebasestorage.app/o/1.PNG?alt=media&token=43224910-f89f-4881-9114-dcf1407624df" alt="Kitchen Photo 1">
        </div>
        <div class="photo">
          <img class="issue-photo" src="https://firebasestorage.googleapis.com/v0/b/wooma-488f1.firebasestorage.app/o/1.PNG?alt=media&token=43224910-f89f-4881-9114-dcf1407624df" alt="Kitchen Photo 1">
        </div>
        <div class="photo">
          <img class="issue-photo" src="https://firebasestorage.googleapis.com/v0/b/wooma-488f1.firebasestorage.app/o/1.PNG?alt=media&token=43224910-f89f-4881-9114-dcf1407624df" alt="Kitchen Photo 1">
        </div>
        <div class="photo">
          <img class="issue-photo" src="https://firebasestorage.googleapis.com/v0/b/wooma-488f1.firebasestorage.app/o/1.PNG?alt=media&token=43224910-f89f-4881-9114-dcf1407624df" alt="Kitchen Photo 1">
        </div>
      </div>
    </div>

  </div>
</body>

</html>
`;
};
