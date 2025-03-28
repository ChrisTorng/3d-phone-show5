# 程式碼指南

## 1. 程式碼品質與風格
- 所有註解不要以「現在為何要加入這個修改」的語氣撰寫，而是以「程式碼中應該長期存留什麼樣的註解」方式撰寫
- 必須仔細並全面地考慮最佳的程式碼撰寫風格
- 命名慣例：使用具描述性且一致的命名方式，變數名稱應反映其用途與內容
- 程式碼結構：邏輯相關的部分應組織在一起，功能應模組化且單一職責
- 一致性：遵循專案既有的程式碼風格和模式

## 2. 技術實作考量
- 錯誤處理：提供全面且優雅的錯誤處理機制，避免程式崩潰
- 效能考量：生成的程式碼應考慮效能影響，避免不必要的運算或記憶體使用
- 安全性：遵循安全編碼原則，防止常見的安全漏洞
- 相依性管理：明確且最小化外部相依套件的使用
- 向後相容性：在修改現有功能時，應考慮維持向後相容性

## 3. 可維護性與測試
- 可測試性：程式碼應易於編寫單元測試，避免難以測試的設計
- 可維護性：程式碼應易於理解與修改，避免過度複雜的實現
- 測試框架：JS 選用 Jest，Python 選用 Pytest
- 修改程式碼時確保所有測試都通過

## 4. 文件與規範
- 文件：關鍵函式、類別和複雜邏輯應有清晰的文件說明
- 修改程式碼時需更新 mermaid_uml.md 檔案
- 需隨時更新 README.md 檔案，確保專案說明、使用方式、技術堆疊等資訊是最新的

## 5. 使用者體驗與無障礙
- 國際化與在地化：考慮多語言支援需求
- 無障礙性：確保生成的程式碼符合相關的無障礙標準
