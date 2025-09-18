// utils/cades.ts
export async function getCertificateInfo() {
  try {
    const cadesplugin = (window as any).cadesplugin;
    await cadesplugin.async_spawn(async function* (): Generator<Promise<any>, any, any> {
      // 1. Получаем store сертификатов
      const store = yield cadesplugin.CreateObjectAsync("CAdESCOM.Store");
      yield store.Open(
        cadesplugin.CAPICOM_CURRENT_USER_STORE,
        cadesplugin.CAPICOM_MY_STORE,
        cadesplugin.CAPICOM_STORE_OPEN_MAXIMUM_ALLOWED
      );

      // 2. Берём коллекцию сертификатов
      const certs = yield store.Certificates;
      const count = yield certs.Count;

      if (count === 0) {
        console.warn("Нет доступных сертификатов");
        return null;
      }

      // 3. Берём первый сертификат
      const cert = yield certs.Item(1);

      // 4. Читаем свойства
      const subject = yield cert.SubjectName;
      const issuer = yield cert.IssuerName;
      const validFrom = yield cert.ValidFromDate;
      const validTo = yield cert.ValidToDate;
      const thumbprint = yield cert.Thumbprint;

      yield store.Close();

      return {
        subject,
        issuer,
        validFrom,
        validTo,
        thumbprint,
      };
    });
  } catch (err) {
    console.error("Ошибка при работе с Cades plugin:", err);
    return null;
  }
}
