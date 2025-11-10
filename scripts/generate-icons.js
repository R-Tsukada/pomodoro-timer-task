/**
 * PWAアイコン生成スクリプト
 * 既存のスクリーンショットからPWA用のアイコンを生成します
 */

const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

const SOURCE_IMAGE = path.join(__dirname, '../.playwright-mcp/pomodoro-updated.png')
const OUTPUT_DIR = path.join(__dirname, '../public/icons')

const ICON_SIZES = [
  { name: 'icon-192.png', size: 192 },
  { name: 'icon-512.png', size: 512 },
  { name: 'apple-touch-icon.png', size: 180 },
]

async function generateIcons() {
  try {
    // 出力ディレクトリが存在することを確認
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true })
      console.log(`✅ ディレクトリ作成: ${OUTPUT_DIR}`)
    }

    // ソース画像が存在するか確認
    if (!fs.existsSync(SOURCE_IMAGE)) {
      console.error(`❌ ソース画像が見つかりません: ${SOURCE_IMAGE}`)
      console.log('💡 単色のプレースホルダーアイコンを生成します...')
      await generatePlaceholderIcons()
      return
    }

    console.log(`📷 ソース画像: ${SOURCE_IMAGE}`)

    // 各サイズのアイコンを生成
    for (const { name, size } of ICON_SIZES) {
      const outputPath = path.join(OUTPUT_DIR, name)

      await sharp(SOURCE_IMAGE)
        .resize(size, size, {
          fit: 'cover',
          position: 'center',
        })
        .png()
        .toFile(outputPath)

      console.log(`✅ 生成完了: ${name} (${size}x${size})`)
    }

    console.log('\n🎉 すべてのアイコンを生成しました！')
  } catch (error) {
    console.error('❌ エラーが発生しました:', error.message)
    process.exit(1)
  }
}

/**
 * プレースホルダーアイコンを生成（ソース画像がない場合）
 */
async function generatePlaceholderIcons() {
  const PRIMARY_COLOR = { r: 16, g: 185, b: 129 } // #10b981 (emerald-500)

  for (const { name, size } of ICON_SIZES) {
    const outputPath = path.join(OUTPUT_DIR, name)

    await sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: PRIMARY_COLOR,
      },
    })
      .png()
      .toFile(outputPath)

    console.log(`✅ プレースホルダー生成: ${name} (${size}x${size})`)
  }

  console.log('\n💡 後で適切なデザインのアイコンに差し替えてください')
}

// スクリプト実行
generateIcons()
