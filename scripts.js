document.getElementById('uploadExcel').addEventListener('change', function(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function(event) {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        const sheetName = workbook.SheetNames[0]; // Chọn sheet đầu tiên
        const worksheet = workbook.Sheets[sheetName];

        // Chuyển đổi sheet thành JSON
        const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // Điền dữ liệu từ tệp Excel vào bảng
        const tbody = document.querySelector('#vocabularyTable tbody');
        tbody.innerHTML = ''; // Xóa dữ liệu cũ

        json.forEach((row) => {
            const [koreanWord, vietnameseMeaning] = row;
            const newRow = document.createElement('tr');

            newRow.innerHTML = `
                <td class="koreanWord">${koreanWord}</td>
                <td>${vietnameseMeaning}</td>
                <td><input type="text" class="inputKorean" placeholder="Nhập câu trả lời"></td>
                <td class="result"></td>
                <td class="keyInfo"></td> <!-- Thêm cột để hiển thị thông tin phím -->
            `;
            tbody.appendChild(newRow);
        });

        // Thêm sự kiện cho các ô nhập liệu
        const inputFields = document.querySelectorAll('.inputKorean');
        inputFields.forEach(inputField => {
            inputField.addEventListener('keydown', function(event) {
                const keyInfoCell = inputField.closest('tr').querySelector('.keyInfo');
                keyInfoCell.textContent = `Phím nhấn: ${event.key}`; // Hiển thị thông tin phím nhấn

                // Kiểm tra nếu phím nhấn là Enter hoặc ArrowRight
                if (event.key === 'Enter' || event.key === 'ArrowRight') {
                    checkAnswers(); // Kiểm tra câu trả lời
                    inputField.blur(); // Bỏ chọn ô nhập liệu
                }
            });
        });
    };

    reader.readAsArrayBuffer(file);
});

// Hàm kiểm tra câu trả lời
function checkAnswers() {
    const rows = document.querySelectorAll('#vocabularyTable tbody tr');

    rows.forEach(row => {
        const koreanWord = row.querySelector('.koreanWord').textContent.trim();
        const inputKorean = row.querySelector('.inputKorean').value.trim();
        const resultCell = row.querySelector('.result');

        // Kiểm tra câu trả lời và hiển thị kết quả
        if (inputKorean === koreanWord) {
            resultCell.textContent = '✔';  // Hiển thị ✔ nếu đúng
            resultCell.classList.add('correct');
            resultCell.classList.remove('incorrect');
        } else {
            resultCell.textContent = '✘';  // Hiển thị ✘ nếu sai
            resultCell.classList.add('incorrect');
            resultCell.classList.remove('correct');
        }
    });
}
