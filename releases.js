// DeskFit Releases - Dynamic Content Renderer
// Fetches releases.json and renders content with hero, features, and release info

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

    // Update hero section with dynamic content
    function updateHero(data) {
        const latestRelease = data.releases.find(r => r.version === data.latest) || data.releases[0];
        const appInfo = data.appInfo || {};

        // Update hero download button with latest version
        const heroBtn = document.getElementById('hero-download-btn');
        if (heroBtn && latestRelease) {
            heroBtn.href = latestRelease.downloadUrl;
            heroBtn.textContent = `Download DeskFit v${latestRelease.version}`;
        }

        // Update hero stats with total releases
        const heroStats = document.getElementById('hero-stats');
        if (heroStats && appInfo.totalReleases) {
            heroStats.textContent = `${appInfo.totalReleases} Releases • Free Forever • Universal Binary • Apple Notarized`;
        }

        // Update hero tagline and description from appInfo if provided
        if (appInfo.tagline) {
            const tagline = document.getElementById('hero-tagline');
            if (tagline) tagline.textContent = appInfo.tagline;
        }

        if (appInfo.description) {
            const description = document.getElementById('hero-description');
            if (description) description.textContent = appInfo.description;
        }
    }

    // Render latest release section
    function renderLatestRelease(release) {
        const badgeHTML = release.badge ? `<span class="new-badge">${release.badge}!</span>` : '';

        const highlightsHTML = release.highlights.map(highlight => {
            const formatted = highlight.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            const emoji = formatted.includes('CRITICAL') ? '🚨' :
                         formatted.includes('Integration') ? '🔄' :
                         formatted.includes('Universal') ? '🚀' :
                         formatted.includes('Simplified') ? '✨' :
                         formatted.includes('notarization') ? '✅' :
                         formatted.includes('stability') ? '💪' :
                         formatted.includes('icon') ? '🎨' :
                         formatted.includes('analytics') ? '📊' :
                         formatted.includes('features') ? '📦' : '';
            return `<li>${emoji} ${formatted}</li>`;
        }).join('');

        return `
            <div class="release">
                <h2>${release.emoji} Latest Release - v${release.version} ${badgeHTML}</h2>
                <p><strong>🎯 ${release.title}</strong></p>
                <p style="color: #666; font-size: 15px; margin-bottom: 20px;">Released ${formatDate(release.date)} • ${release.size}</p>

                <h3>What's New</h3>
                <ul>${highlightsHTML}</ul>

                <a href="${release.downloadUrl}" class="download-btn" download>
                    Download DeskFit v${release.version}
                </a>

                <details class="technical-details">
                    <summary>Technical Details</summary>
                    <ul style="margin-top: 12px;">
                        <li><strong>Version:</strong> ${release.version} (Build ${release.build})</li>
                        <li><strong>Size:</strong> ${release.size}</li>
                        <li><strong>Minimum macOS:</strong> ${release.technical.minimumOS}</li>
                        <li><strong>Architecture:</strong> ${release.technical.architecture}</li>
                        <li><strong>Signed & Notarized:</strong> ${release.technical.signed && release.technical.notarized ? '✅ Developer ID Application' : '❌ No'}</li>
                    </ul>
                </details>
            </div>
        `;
    }

    // Render release history section
    function renderReleaseHistory(releases) {
        const previousReleases = releases.slice(1);

        if (previousReleases.length === 0) {
            return '';
        }

        const historyItemsHTML = previousReleases.map(release => {
            const highlightsPreview = release.highlights.slice(0, 3).map(h => {
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

        // Update hero section with dynamic data
        updateHero(data);

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
