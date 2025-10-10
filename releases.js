// DeskFit Releases - Dynamic Content Renderer
// Fetches releases.json and renders latest release + history

(function() {
    'use strict';

    // Fetch releases data
    async function fetchReleases() {
        try {
            const response = await fetch('releases.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching releases:', error);
            showError('Unable to load release information. Please try again later.');
            return null;
        }
    }

    // Format date to readable string
    function formatDate(dateString) {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    // Format file size for display
    function formatSize(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }

    // Render latest release section
    function renderLatestRelease(release) {
        const badgeHTML = release.badge ? `<span class="new-badge">${release.badge}!</span>` : '';

        const highlightsHTML = release.highlights.map(highlight => {
            // Check if highlight has bold markdown-style formatting
            const formatted = highlight.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            // Add emoji for main features
            const emoji = formatted.includes('Integration') ? '🔄' :
                         formatted.includes('Universal') ? '🚀' :
                         formatted.includes('Simplified') ? '✨' :
                         formatted.includes('notarization') ? '✅' :
                         formatted.includes('stability') ? '💪' :
                         formatted.includes('icon') ? '🎨' :
                         formatted.includes('features') ? '📦' : '';
            return `<li>${emoji} ${formatted}</li>`;
        }).join('');

        return `
            <div class="release">
                <h2>${release.emoji} Latest Release - v${release.version} ${badgeHTML}</h2>
                <p><strong>🎯 ${release.title}</strong></p>
                <p>✅ <strong>Automatic Updates:</strong> DeskFit now uses GitHub Releases for seamless automatic updates!</p>

                <h3>📥 Simple Installation</h3>
                <ol style="text-align: left; margin: 15px 0;">
                    <li><strong>Download</strong> the DMG file below</li>
                    <li><strong>Open</strong> the DMG and drag DeskFit.app to Applications</li>
                    <li>✅ <strong>Done!</strong> Launch DeskFit normally - no warnings!</li>
                    <li>🔄 <strong>Future updates</strong> install automatically via "Check for Updates"</li>
                </ol>

                <p><strong>What's New in v${release.version}:</strong></p>
                <ul>${highlightsHTML}</ul>

                <p><strong>Technical Details:</strong></p>
                <ul>
                    <li>Version: ${release.version} (Build ${release.build})</li>
                    <li>Size: ${release.size}</li>
                    <li>Architecture: ${release.technical.architecture}</li>
                    <li>Signed & Notarized: ${release.technical.signed && release.technical.notarized ? 'Developer ID Application' : 'No'}</li>
                </ul>

                <a href="${release.downloadUrl}"
                   class="download-btn" download>Download DeskFit v${release.version}</a>
            </div>
        `;
    }

    // Render release history section
    function renderReleaseHistory(releases) {
        // Skip the latest release (already shown above)
        const previousReleases = releases.slice(1);

        if (previousReleases.length === 0) {
            return '';
        }

        const historyItemsHTML = previousReleases.map(release => {
            const highlightsPreview = release.highlights.slice(0, 3).map(h => {
                // Remove markdown bold for preview
                return h.replace(/\*\*(.*?)\*\*/g, '$1');
            }).join(', ');

            return `
                <div class="history-item">
                    <div class="history-header">
                        <div>
                            <span class="version-badge">v${release.version}</span>
                            <span class="history-title">${release.emoji} ${release.title}</span>
                        </div>
                        <div class="history-meta">
                            <span class="release-date">${formatDate(release.date)}</span>
                            <span class="release-size">${release.size}</span>
                        </div>
                    </div>
                    <div class="history-details">
                        <p class="highlights-preview">${highlightsPreview}...</p>
                        <a href="${release.downloadUrl}" class="download-link" download>
                            Download v${release.version}
                        </a>
                    </div>
                </div>
            `;
        }).join('');

        return `
            <div class="release release-history">
                <h2>📚 Release History</h2>
                <p>Previous versions of DeskFit are available below. We recommend using the latest version for the best experience.</p>
                ${historyItemsHTML}
            </div>
        `;
    }

    // Show error message
    function showError(message) {
        const container = document.getElementById('latest-release');
        if (container) {
            container.innerHTML = `
                <div class="release error-message">
                    <h2>⚠️ Error</h2>
                    <p>${message}</p>
                </div>
            `;
        }
    }

    // Main initialization
    async function init() {
        const data = await fetchReleases();

        if (!data || !data.releases || data.releases.length === 0) {
            return;
        }

        // Find latest release
        const latestRelease = data.releases.find(r => r.version === data.latest) || data.releases[0];

        // Render latest release
        const latestContainer = document.getElementById('latest-release');
        if (latestContainer) {
            latestContainer.innerHTML = renderLatestRelease(latestRelease);
        }

        // Render release history
        const historyContainer = document.getElementById('release-history');
        if (historyContainer) {
            historyContainer.innerHTML = renderReleaseHistory(data.releases);
        }
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
