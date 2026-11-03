!macro customInstall
  nsExec::Exec 'netsh advfirewall firewall add rule name="OrcaCast TV" dir=in action=allow program="$INSTDIR\OrcaCast TV.exe" enable=yes profile=any'
  nsExec::Exec 'netsh advfirewall firewall add rule name="OrcaCast TV Port" dir=in action=allow protocol=TCP localport=8787-8799 profile=any'
!macroend
!macro customUnInstall
  nsExec::Exec 'netsh advfirewall firewall delete rule name="OrcaCast TV"'
  nsExec::Exec 'netsh advfirewall firewall delete rule name="OrcaCast TV Port"'
!macroend
