<#
Safe helper script to export data from MySQL and import into PostgreSQL.

Usage (edit connection strings before running):
1. Export from MySQL:
   .\mysql-to-postgres-migration.ps1 -Action export -MySqlConn 'server=127.0.0.1;uid=root;pwd=pass;database=stylo'

2. Import into PostgreSQL:
   .\mysql-to-postgres-migration.ps1 -Action import -PgConn 'Host=localhost;Port=5432;Username=pguser;Password=pgpass;Database=postgres'

This script creates CSV dumps for each table and then imports them into Postgres using psql's \copy.
It does NOT drop or modify existing tables. Review CSVs before import.
#>

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet('export','import')]
    [string]$Action,

    [string]$MySqlConn,
    [string]$PgConn
)

function Export-FromMysql {
    param($connStr)
    Write-Host "Exporting from MySQL: $connStr"
    $outdir = Join-Path -Path (Get-Location) -ChildPath "mysql_export_$(Get-Date -Format yyyyMMddHHmmss)"
    New-Item -ItemType Directory -Path $outdir | Out-Null

    $tables = @('User','Item','Outfit','OutfitItem')
    foreach ($t in $tables) {
        $csv = Join-Path $outdir "$t.csv"
        # Use mysqldump with --tab is another approach; here we use SELECT ... INTO OUTFILE if available.
        # For maximum compatibility we call mysql and output CSV via CONCAT and separators.
        $query = "SELECT * FROM `$t`"
        Write-Host "Exporting table $t to $csv"
        # This requires the `mysql` CLI to be installed and available in PATH.
        & mysql --batch --raw --silent --execute="$query" $connStr | Out-File -FilePath $csv -Encoding utf8
    }
    Write-Host "Export complete. Files in: $outdir"
}

function Import-IntoPostgres {
    param($connStr)
    Write-Host "Importing into Postgres: $connStr"
    $files = Get-ChildItem -Path (Get-Location) -Filter '*.csv' -Recurse
    foreach ($f in $files) {
        $table = [System.IO.Path]::GetFileNameWithoutExtension($f.Name)
        Write-Host "Importing $($f.FullName) into $table"
        # Use psql \copy; requires psql in PATH.
        $copyCmd = "\copy \"$table\" FROM '$($f.FullName)' CSV"
        psql "$connStr" -c $copyCmd
    }
}

if ($Action -eq 'export') {
    if (-not $MySqlConn) { Write-Error "MySqlConn is required for export"; exit 1 }
    Export-FromMysql -connStr $MySqlConn
} elseif ($Action -eq 'import') {
    if (-not $PgConn) { Write-Error "PgConn is required for import"; exit 1 }
    Import-IntoPostgres -connStr $PgConn
}
